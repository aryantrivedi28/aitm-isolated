import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../lib/agreements/supabase-server"
import { DocuSealClient } from "../../../../lib/agreements/docuseal-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.text()
    const signature = request.headers.get("x-docuseal-signature")

    // Verify webhook signature
    const webhookSecret = process.env.DOCUSEAL_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const isValid = DocuSealClient.verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const webhookData = JSON.parse(body)
    const { event_type, data } = webhookData

    if (event_type === "submission.completed") {
      const submissionId = data.id
      const completedAt = data.completed_at
      const auditTrailUrl = data.audit_trail_url
      const documents = data.documents || []

      // Find the document in our database
      const tables = ["client_agreements", "freelancer_agreements", "invoices"]
      let updatedDocument = null

      for (const table of tables) {
        const { data: docs, error } = await supabase.from(table).select("*").eq("docuseal_envelope_id", submissionId)

        if (!error && docs && docs.length > 0) {
          const signedPdfUrl = documents.length > 0 ? documents[0].url : null

          const { data: updated, error: updateError } = await supabase
            .from(table)
            .update({
              status: "signed",
              signed_at: completedAt,
              signed_pdf_url: signedPdfUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("docuseal_envelope_id", submissionId)
            .select()
            .single()

          if (!updateError) {
            updatedDocument = updated
            break
          }
        }
      }

      if (!updatedDocument) {
        console.error("Document not found for submission:", submissionId)
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
      }

      // Log the completion
      await supabase.from("email_logs").insert([
        {
          recipient_email: data.submitters?.[0]?.email || "unknown",
          subject: "Document Signed Successfully",
          template_type: "document_signed",
          reference_id: updatedDocument.id,
          status: "sent",
          sent_at: new Date().toISOString(),
        },
      ])

      return NextResponse.json({ message: "Webhook processed successfully" })
    }

    if (event_type === "submission.expired") {
      const submissionId = data.id

      // Update document status to expired
      const tables = ["client_agreements", "freelancer_agreements", "invoices"]

      for (const table of tables) {
        await supabase
          .from(table)
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("docuseal_envelope_id", submissionId)
      }

      return NextResponse.json({ message: "Document marked as expired" })
    }

    return NextResponse.json({ message: "Webhook received" })
  } catch (error) {
    console.error("Error processing DocuSeal webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
