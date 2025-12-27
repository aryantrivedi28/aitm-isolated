import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'


export async function POST(request: NextRequest) {
  console.log('🚀 [UPLOAD] Request received')

  try {
    console.log('📦 [STEP 1] Reading formData...')
    const formData = await request.formData()

    const file = formData.get('pdf') as File
    console.log('📄 [STEP 2] File received:', {
      exists: !!file,
      name: file?.name,
      type: file?.type,
      size: file?.size,
    })

    const metadata = {
      projectTitle: formData.get('projectTitle') as string,
      role: formData.get('role') as string,
      serviceType: formData.get('serviceType') as string,
      toolsUsed: (formData.get('toolsUsed') as string)
        ?.split(',')
        .map(t => t.trim())
        .filter(Boolean),
      shortDescription: formData.get('shortDescription') as string,
    }

    console.log('📝 [STEP 3] Metadata parsed:', metadata)

    if (!file || file.type !== 'application/pdf') {
      console.error('❌ [VALIDATION] Invalid file uploaded')
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    console.log('🆔 [STEP 4] Generated file info:', {
      fileName,
      filePath,
    })

    // Convert file to buffer
    console.log('🔄 [STEP 5] Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ [STEP 5] Buffer created, size:', buffer.length)

    // Upload to Supabase Storage
    console.log('☁️ [STEP 6] Uploading to Supabase Storage...')
    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('pdf-portfolios')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (storageError) {
      console.error('❌ [STORAGE ERROR]', storageError)
      throw storageError
    }

    console.log('✅ [STEP 6] Upload successful:', storageData)

    // Get signed URL
    console.log('🔗 [STEP 7] Creating signed URL...')
    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin
        .storage
        .from('pdf-portfolios')
        .createSignedUrl(filePath, 60 * 60)

    if (signedUrlError) {
      console.error('❌ [SIGNED URL ERROR]', signedUrlError)
      throw signedUrlError
    }

    console.log('✅ [STEP 7] Signed URL created:', signedUrlData?.signedUrl)

    // Create temporary DB record
    const tempId = `temp_${Date.now()}_${uuidv4().substring(0, 8)}`
    console.log('🆔 [STEP 8] Generated tempId:', tempId)

    console.log('🗄️ [STEP 9] Inserting record into DB...')
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('portfolio_uploads')
      .insert({
        temp_id: tempId,
        raw_source_ref: {
          type: 'pdf',
          url: signedUrlData?.signedUrl || filePath,
        },
        file_path: filePath,
        project_title: metadata.projectTitle,
        role: metadata.role,
        service_type: metadata.serviceType,
        tools_used: metadata.toolsUsed,
        short_description: metadata.shortDescription,
        status: 'uploaded',
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ [DB ERROR] Insert failed:', dbError)

      console.log('🧹 [CLEANUP] Removing uploaded file...')
      await supabaseAdmin.storage
        .from('pdf-portfolios')
        .remove([filePath])

      throw dbError
    }

    console.log('✅ [STEP 9] DB record created:', dbData)

    console.log('🎉 [SUCCESS] Upload completed')

    return NextResponse.json({
      success: true,
      message: 'PDF uploaded successfully',
      tempId,
      filePath,
      nextStep: 'process',
    })

  } catch (error) {
    console.error('🔥 [FATAL ERROR]', error)

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
