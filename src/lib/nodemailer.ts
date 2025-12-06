// app/lib/nodemailer.ts (or your existing email utility)
import nodemailer from 'nodemailer'

// Create transporter using your existing configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer connection error:', error)
  } else {
    console.log('✅ Nodemailer is ready to send emails')
  }
})

export async function sendEmail({
  to,
  subject,
  html,
  from = `"AITM Notifications" <${process.env.SMTP_USER}>`,
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  try {
    const recipients = Array.isArray(to) ? to.join(',') : to
    
    const info = await transporter.sendMail({
      from,
      to: recipients,
      subject,
      html,
    })
    
    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return { success: false, error }
  }
}

export default transporter