import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../lib/agreements/supabase-server"
import { PDFGenerator } from "../../../../lib/agreements/pdf-generator"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
      console.log("juoiwe")
      try {
            const supabase = await createClient()
            const body = await request.json()
            const { invoiceId } = body
            console.log(body)

            if (!invoiceId) {
                  return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
            }
            console.log("juoiwe1")
            // Get invoice data with items
            const { data: invoice, error: invoiceError } = await supabase
                  .from("invoices")
                  .select(`
        *,
        invoice_items (*)
      `)
                  .eq("id", invoiceId)
                  .single()
            console.log(invoice, invoiceError)

            console.log("juoiwe2")

            if (invoiceError || !invoice) {
                  return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
            }

            // Get invoice template
            const { data: template, error: templateError } = await supabase
                  .from("document_templates")
                  .select("*")
                  .eq("type", "invoice")
                  .eq("is_active", true)
                  .single()

            if (templateError || !template) {
                  return NextResponse.json({ error: "Invoice template not found" }, { status: 404 })
            }

            // Generate PDF
            const pdfBuffer = await PDFGenerator.generateInvoicePDF(invoice, invoice.invoice_items || [], template)
console.log(pdfBuffer)
            // Upload to Vercel Blob
            const filename = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`
            const blob = await put(filename, pdfBuffer, {
                  access: "public",
                  contentType: "application/pdf",
                  token: process.env.BLOB_READ_WRITE_TOKEN, // token is now picked up
            })


            // Update invoice with PDF URL
            const { error: updateError } = await supabase
                  .from("invoices")
                  .update({
                        pdf_url: blob.url,
                        updated_at: new Date().toISOString(),
                  })
                  .eq("id", invoiceId)

            if (updateError) {
                  console.error("Error updating invoice with PDF URL:", updateError)
            }

            return NextResponse.json({
                  pdfUrl: blob.url,
                  message: "Invoice PDF generated successfully",
            })
      } catch (error) {
            console.error("Error generating invoice PDF:", error)
            return NextResponse.json({ error: "Failed to generate invoice PDF" }, { status: 500 })
      }
}
