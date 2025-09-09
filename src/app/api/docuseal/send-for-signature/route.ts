import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../lib/agreements/supabase-server"
import { createDocuSealClient } from "../../../../lib/agreements/docuseal-client"

export async function POST(request: NextRequest) {
  console.log("🔹 [API] /api/send-for-signature called")

  try {
    const supabase = await createClient()
    const docuseal = createDocuSealClient()
    const body = await request.json()

    console.log("📥 Request body:", body)

    const { documentId, documentType, signerEmail, signerName } = body

    if (!documentId || !documentType || !signerEmail || !signerName) {
      console.error("❌ Missing required fields:", { documentId, documentType, signerEmail, signerName })
      return NextResponse.json(
        { error: "Missing required fields: documentId, documentType, signerEmail, signerName" },
        { status: 400 }
      )
    }

    // ---------------------------
    // 1. Fetch document record
    // ---------------------------
    const tableName =
      documentType === "invoice"
        ? "invoices"
        : documentType === "client"
        ? "client_agreements"
        : "freelancer_agreements"

    console.log(`📂 Fetching document from table: ${tableName}, id: ${documentId}`)

    const { data: document, error: docError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", documentId)
      .single()

    if (docError || !document) {
      console.error("❌ Document not found:", docError)
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    console.log("✅ Document fetched:", document)

    if (!document.pdf_url) {
      console.warn("⚠️ Document does not have a PDF yet:", documentId)
      return NextResponse.json({ error: "Document PDF not generated yet" }, { status: 400 })
    }

    // ---------------------------
    // 2. Fetch template from DB
    // ---------------------------
    console.log(`📑 Looking up template for type: ${documentType}`)

    const { data: dbTemplate, error: templateError } = await supabase
      .from("document_templates")
      .select("id, docuseal_template_id, name")
      .eq("type", documentType)
      .eq("is_active", true)
      .single()

    if (templateError || !dbTemplate) {
      console.error("❌ No matching template in DB:", templateError)
      return NextResponse.json(
        { error: `No active template found in DB for type: ${documentType}` },
        { status: 404 }
      )
    }

    if (!dbTemplate.docuseal_template_id) {
      console.error("❌ Template exists in DB but missing docuseal_template_id")
      return NextResponse.json(
        { error: "Template exists but not linked to a DocuSeal template" },
        { status: 500 }
      )
    }

    const templateId = dbTemplate.docuseal_template_id
    console.log("✅ Using DocuSeal template ID from DB:", templateId)

    // ---------------------------
    // 3. Create submission
    // ---------------------------
    console.log("✍️ Creating DocuSeal submission for signer:", signerEmail, signerName)

    const submission = await docuseal.createSubmission(templateId, [
      {
        email: signerEmail,
        name: signerName,
        role: "signer",
      },
    ])

    console.log("✅ Submission created:", submission)

    // ---------------------------
    // 4. Update document with submission ID
    // ---------------------------
    console.log(`📝 Updating ${tableName} with DocuSeal submission ID:`, submission.id)

    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        docuseal_envelope_id: submission.id,
        status: "sent",
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)

    if (updateError) {
      console.error("❌ Error updating document with DocuSeal ID:", updateError)
    } else {
      console.log("✅ Document updated with DocuSeal submission ID")
    }

    return NextResponse.json({
      submissionId: submission.id,
      signingUrl: submission.submitters[0]?.signature_url,
      message: "Document sent for signature successfully",
    })
  } catch (error) {
    console.error("🔥 Unexpected error in send-for-signature:", error)
    return NextResponse.json({ error: "Failed to send document for signature" }, { status: 500 })
  }
}
