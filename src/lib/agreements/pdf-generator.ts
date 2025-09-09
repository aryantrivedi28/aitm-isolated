import puppeteer from "puppeteer"
import type { DocumentTemplate, ClientAgreement, FreelancerAgreement, Invoice } from "../../types/agreement"

export class PDFGenerator {
  private static async getBrowser() {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }

  static async generateClientAgreementPDF(agreement: ClientAgreement, template: DocumentTemplate): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    // Replace template variables with actual data
    const htmlContent = template.template_content
      .replace(/{{date}}/g, new Date().toLocaleDateString())
      .replace(/{{client_name}}/g, agreement.client_name)
      .replace(/{{client_address}}/g, agreement.client_address)
      .replace(/{{project_title}}/g, agreement.project_title)
      .replace(/{{scope}}/g, agreement.scope)
      .replace(/{{deliverables}}/g, agreement.deliverables)
      .replace(/{{payment_terms}}/g, agreement.payment_terms)
      .replace(/{{terms}}/g, agreement.terms)

    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded", // faster + safer for static HTML
      timeout: 0, // disable timeout if needed
    })


    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    await browser.close()
    return Buffer.from(pdf)
  }

  static async generateFreelancerAgreementPDF(
    agreement: FreelancerAgreement,
    template: DocumentTemplate,
  ): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    const htmlContent = template.template_content
      .replace(/{{date}}/g, new Date().toLocaleDateString())
      .replace(/{{freelancer_name}}/g, agreement.freelancer_name)
      .replace(/{{client_name}}/g, agreement.client_name)
      .replace(/{{work_type}}/g, agreement.work_type)
      .replace(/{{nda}}/g, agreement.nda)
      .replace(/{{ip_rights}}/g, agreement.ip_rights)
      .replace(/{{deliverables}}/g, agreement.deliverables)
      .replace(/{{terms}}/g, agreement.terms)
      .replace(/{{hourly_rate}}/g, agreement.hourly_rate?.toString() || "TBD")
      .replace(/{{project_duration}}/g, agreement.project_duration || "TBD")

    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded", // faster + safer for static HTML
      timeout: 0, // disable timeout if needed
    })


    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    await browser.close()
    return Buffer.from(pdf)
  }
static async generateInvoicePDF(invoice: Invoice, items: any[], template: DocumentTemplate): Promise<Buffer> {
  const browser = await this.getBrowser()
  const page = await browser.newPage()

  // Generate invoice items HTML
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${invoice.currency} ${item.rate.toFixed(2)}</td>
          <td>${invoice.currency} ${item.amount.toFixed(2)}</td>
        </tr>
      `
    )
    .join("")

  const htmlContent = template.template_content
    .replace(/{{invoice_number}}/g, invoice.invoice_number || "INV-" + Date.now())
    .replace(/{{date}}/g, new Date(invoice.invoice_date || new Date()).toLocaleDateString())
    .replace(/{{client_name}}/g, invoice.client_name || "")
    .replace(/{{client_address}}/g, invoice.client_address || "")
    .replace(/{{project_title}}/g, invoice.project_title || "")
    .replace(/{{due_date}}/g, invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "")
    .replace(/{{invoice_items}}/g, itemsHtml)
    .replace(/{{currency}}/g, invoice.currency || "USD")
    .replace(/{{amount}}/g, (invoice.amount || 0).toFixed(2))
    .replace(/{{tax_amount}}/g, (invoice.tax_amount || 0).toFixed(2))
    .replace(/{{total_amount}}/g, (invoice.total_amount || invoice.amount || 0).toFixed(2))
    .replace(/{{terms}}/g, invoice.terms || "")
    // 🔥 Add these replacements for payee & banking info
    .replace(/{{payee_name}}/g, invoice.payee_name || "")
    .replace(/{{account_number}}/g, invoice.account_number || "")
    .replace(/{{account_type}}/g, invoice.account_type || "")
    .replace(/{{routing_number}}/g, invoice.routing_number || "")
    .replace(/{{payment_method}}/g, invoice.payment_method || "")

  await page.setContent(htmlContent, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  })

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
  })

  await browser.close()
  return Buffer.from(pdf)
}

}
