// import chromium from "@sparticuz/chromium"
// import puppeteer from "puppeteer-core"
import type { ClientAgreement, FreelancerAgreement, Invoice } from "../../types/agreement"
import {
  generateClientAgreementTemplate,
  generateFreelancerAgreementTemplate,
  generateInvoiceTemplate,
} from "./pdf-templates"

import chromium from "@sparticuz/chromium"
import puppeteer from "puppeteer-core"

export class PDFGenerator {
  private static async getBrowser() {
    // Check if running on Vercel (serverless env)
    const isVercel = !!process.env.VERCEL

    if (isVercel) {
      console.log("🚀 Running in Vercel serverless - using @sparticuz/chromium")
      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true, // or chromium.headless if you want
      });
      return browser
    } else {
      console.log("💻 Running locally - using full Puppeteer")
      // Lazy import so you don’t ship full Puppeteer to Vercel
      const puppeteerLocal = await import("puppeteer")
      return puppeteerLocal.default.launch({
        headless: true,
      })
    }
  }

  static async generateClientAgreementPDF(agreement: ClientAgreement): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    const htmlContent = generateClientAgreementTemplate(agreement)

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

  static async generateFreelancerAgreementPDF(agreement: FreelancerAgreement): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    const htmlContent = generateFreelancerAgreementTemplate(agreement)

    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "25mm",
        right: "25mm",
        bottom: "25mm",
        left: "25mm",
      },
    })

    await browser.close()
    return Buffer.from(pdf)
  }

  static async generateInvoicePDF(invoice: Invoice, items: any[]): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    const htmlContent = generateInvoiceTemplate(invoice, items)

    try {
      await page.setContent(htmlContent, {
        waitUntil: "load",
        timeout: 30000,
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

      return Buffer.from(pdf)
    } finally {
      await browser.close()
    }
  }
}
