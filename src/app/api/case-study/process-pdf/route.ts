import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { extractTextFromPDF } from '../../../../lib/pdf-process'
import { structurePDFContent } from '../../../../lib/openaiProcessor'

export async function POST(request: NextRequest) {
  let tempId: string | null = null
  try {
    ({ tempId } = await request.json())
    
    if (!tempId) {
      return NextResponse.json(
        { error: 'tempId is required' },
        { status: 400 }
      )
    }

    // Get the upload record
    const { data: upload, error: fetchError } = await supabaseAdmin
      .from('portfolio_uploads')
      .select('*')
      .eq('temp_id', tempId)
      .single()

    if (fetchError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    // Update status to processing
    await supabaseAdmin
      .from('portfolio_uploads')
      .update({ status: 'processing' })
      .eq('id', upload.id)

    // Download PDF from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('pdf-portfolios')
      .download(upload.file_path!)

    if (downloadError || !fileData) {
      throw new Error('Failed to download PDF')
    }

    // Convert to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Step A3: Extract text from PDF
    const extractedText = await extractTextFromPDF(buffer)

    // Update with extracted text
    const { error: updateError } = await supabaseAdmin
      .from('portfolio_uploads')
      .update({
        extracted_text: extractedText.text,
        extracted_headings: extractedText.headings,
        extracted_bullet_points: extractedText.bulletPoints,
        extracted_metrics: extractedText.metrics,
      })
      .eq('id', upload.id)

    if (updateError) {
      throw updateError
    }

    // Step A4: AI Structuring
    const metadata = {
      projectTitle: upload.project_title,
      role: upload.role,
      serviceType: upload.service_type,
      toolsUsed: upload.tools_used,
      shortDescription: upload.short_description
    }

    const structuredData = await structurePDFContent(extractedText, metadata)

    // Update with structured data
    const { data: finalData, error: finalError } = await supabaseAdmin
      .from('portfolio_uploads')
      .update({
        challenge: structuredData.challenge,
        solution: structuredData.solution,
        process: structuredData.process,
        deliverables: structuredData.deliverables,
        results: structuredData.results,
        summary: structuredData.summary,
        status: 'structured',
        updated_at: new Date().toISOString()
      })
      .eq('id', upload.id)
      .select()
      .single()

    if (finalError) {
      throw finalError
    }

    return NextResponse.json({
      success: true,
      message: 'PDF processed and structured successfully',
      portfolio: {
        id: finalData.id,
        projectTitle: finalData.project_title,
        challenge: finalData.challenge,
        solution: finalData.solution,
        process: finalData.process,
        deliverables: finalData.deliverables,
        results: finalData.results,
        summary: finalData.summary,
        status: finalData.status
      }
    })

  } catch (error) {
    console.error('Processing error:', error)
    
    // Update status to failed
    if (tempId) {
      await supabaseAdmin
        .from('portfolio_uploads')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('temp_id', tempId)
    }
    
    return NextResponse.json(
      { 
        error: 'Processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}