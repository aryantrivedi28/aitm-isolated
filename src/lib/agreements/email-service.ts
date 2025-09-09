interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  private static instance: EmailService
  private smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // In a real implementation, you would use nodemailer or similar
      // For now, we'll log the email and return success
      console.log("[v0] Email would be sent:", {
        to: emailData.to,
        subject: emailData.subject,
        preview: emailData.text.substring(0, 100) + "...",
      })

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error("[v0] Email sending failed:", error)
      return false
    }
  }

  generateDocumentCreatedEmail(data: {
    recipientName: string
    documentType: string
    projectTitle: string
    createdBy: string
  }): EmailTemplate {
    const subject = `New ${data.documentType} Created: ${data.projectTitle}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #241C15; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FFE01B; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Document Created</h1>
            </div>
            <div class="content">
              <p>Hello ${data.recipientName},</p>
              <p>A new ${data.documentType.toLowerCase()} has been created for your project:</p>
              <h3>${data.projectTitle}</h3>
              <p><strong>Created by:</strong> ${data.createdBy}</p>
              <p>The document is currently being prepared and will be sent to you for signature shortly.</p>
              <p>You will receive another notification once the document is ready for your review and signature.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the Agreement Automation System.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Hello ${data.recipientName},

      A new ${data.documentType.toLowerCase()} has been created for your project: ${data.projectTitle}

      Created by: ${data.createdBy}

      The document is currently being prepared and will be sent to you for signature shortly.
      You will receive another notification once the document is ready for your review and signature.

      This is an automated message from the Agreement Automation System.
    `

    return { subject, html, text }
  }

  generateSignatureRequestEmail(data: {
    recipientName: string
    documentType: string
    projectTitle: string
    signatureUrl: string
    senderName: string
  }): EmailTemplate {
    const subject = `Signature Required: ${data.projectTitle}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #241C15; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FFE01B; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Signature Required</h1>
            </div>
            <div class="content">
              <p>Hello ${data.recipientName},</p>
              <div class="urgent">
                <strong>Action Required:</strong> Your signature is needed for the following document.
              </div>
              <p>Please review and sign the ${data.documentType.toLowerCase()} for:</p>
              <h3>${data.projectTitle}</h3>
              <p><strong>Sent by:</strong> ${data.senderName}</p>
              <p>Click the button below to review and sign the document:</p>
              <div style="text-align: center;">
                <a href="${data.signatureUrl}" class="button">Review & Sign Document</a>
              </div>
              <p><strong>Important:</strong> Please review the document carefully before signing. If you have any questions, please contact ${data.senderName} before proceeding.</p>
            </div>
            <div class="footer">
              <p>This signature request was sent through DocuSeal via the Agreement Automation System.</p>
              <p>If you did not expect this document, please contact the sender immediately.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Hello ${data.recipientName},

      ACTION REQUIRED: Your signature is needed for the following document.

      Document: ${data.documentType} for ${data.projectTitle}
      Sent by: ${data.senderName}

      Please review and sign the document using this link: ${data.signatureUrl}

      Important: Please review the document carefully before signing. If you have any questions, please contact ${data.senderName} before proceeding.

      This signature request was sent through DocuSeal via the Agreement Automation System.
      If you did not expect this document, please contact the sender immediately.
    `

    return { subject, html, text }
  }

  generateDocumentSignedEmail(data: {
    recipientName: string
    documentType: string
    projectTitle: string
    signerName: string
    signedDocumentUrl?: string
  }): EmailTemplate {
    const subject = `Document Signed: ${data.projectTitle}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #241C15; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FFE01B; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; color: #155724; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Document Signed ✓</h1>
            </div>
            <div class="content">
              <p>Hello ${data.recipientName},</p>
              <div class="success">
                <strong>Great news!</strong> The document has been successfully signed.
              </div>
              <p>The ${data.documentType.toLowerCase()} for <strong>${data.projectTitle}</strong> has been signed by ${data.signerName}.</p>
              ${
                data.signedDocumentUrl
                  ? `
                <p>You can download the signed document using the link below:</p>
                <div style="text-align: center;">
                  <a href="${data.signedDocumentUrl}" class="button">Download Signed Document</a>
                </div>
              `
                  : ""
              }
              <p>The document is now legally binding and the project can proceed as outlined in the agreement.</p>
            </div>
            <div class="footer">
              <p>This notification was sent automatically by the Agreement Automation System.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Hello ${data.recipientName},

      Great news! The document has been successfully signed.

      Document: ${data.documentType} for ${data.projectTitle}
      Signed by: ${data.signerName}

      ${data.signedDocumentUrl ? `Download signed document: ${data.signedDocumentUrl}` : ""}

      The document is now legally binding and the project can proceed as outlined in the agreement.

      This notification was sent automatically by the Agreement Automation System.
    `

    return { subject, html, text }
  }

  generateReminderEmail(data: {
    recipientName: string
    documentType: string
    projectTitle: string
    signatureUrl: string
    daysPending: number
    senderName: string
  }): EmailTemplate {
    const subject = `Reminder: Signature Pending - ${data.projectTitle}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #241C15; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FFE01B; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .reminder { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Signature Reminder</h1>
            </div>
            <div class="content">
              <p>Hello ${data.recipientName},</p>
              <div class="reminder">
                <strong>Friendly Reminder:</strong> You have a document waiting for your signature.
              </div>
              <p>This is a reminder that the ${data.documentType.toLowerCase()} for <strong>${data.projectTitle}</strong> has been pending your signature for ${data.daysPending} day${data.daysPending > 1 ? "s" : ""}.</p>
              <p><strong>Sent by:</strong> ${data.senderName}</p>
              <p>Please take a moment to review and sign the document:</p>
              <div style="text-align: center;">
                <a href="${data.signatureUrl}" class="button">Review & Sign Document</a>
              </div>
              <p>If you have any questions or concerns about this document, please contact ${data.senderName} directly.</p>
            </div>
            <div class="footer">
              <p>This is an automated reminder from the Agreement Automation System.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Hello ${data.recipientName},

      Friendly Reminder: You have a document waiting for your signature.

      The ${data.documentType.toLowerCase()} for ${data.projectTitle} has been pending your signature for ${data.daysPending} day${data.daysPending > 1 ? "s" : ""}.

      Sent by: ${data.senderName}

      Please review and sign the document: ${data.signatureUrl}

      If you have any questions or concerns about this document, please contact ${data.senderName} directly.

      This is an automated reminder from the Agreement Automation System.
    `

    return { subject, html, text }
  }
}

export const emailService = EmailService.getInstance()
