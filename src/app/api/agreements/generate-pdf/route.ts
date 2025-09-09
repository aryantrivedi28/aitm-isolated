import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../lib/agreements/supabase-server"
import { PDFGenerator } from "../../../../lib/agreements/pdf-generator"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { agreementId, type } = body

    if (!agreementId || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 })
    }

    // Get agreement data
    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements"
    const { data: agreement, error: agreementError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", agreementId)
      .single()

    if (agreementError || !agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    // Get template
    const templateType = type === "client" ? "client_agreement" : "freelancer_agreement"
    const { data: template, error: templateError } = await supabase
      .from("document_templates")
      .select("*")
      .eq("type", templateType)
      .eq("is_active", true)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Generate PDF
    let pdfBuffer: Buffer
    if (type === "client") {
      pdfBuffer = await PDFGenerator.generateClientAgreementPDF(agreement, template)
    } else {
      pdfBuffer = await PDFGenerator.generateFreelancerAgreementPDF(agreement, template)
    }

    // Upload to Vercel Blob
    const filename = `${type}-agreement-${agreementId}-${Date.now()}.pdf`
    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    // Update agreement with PDF URL
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        pdf_url: blob.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", agreementId)

    if (updateError) {
      console.error("Error updating agreement with PDF URL:", updateError)
    }

    return NextResponse.json({
      pdfUrl: blob.url,
      message: "PDF generated successfully",
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
