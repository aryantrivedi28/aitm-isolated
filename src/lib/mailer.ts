import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})



export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string // <-- optional
) => {
  try {
    await transporter.sendMail({
      from: `"Finzie" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }), // ✅ only add if provided
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email send error:", err);
  }
};



export async function sendAdminEmail(data: any) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_HOST || !process.env.ADMIN_EMAIL) {
      console.log('Email not configured, skipping notification');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Client Form" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAILS,
      subject: `New Client Request: ${data.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>📋 New Client Request Submitted</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>👤 Name:</strong> ${data.fullName}</p>
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>📱 Phone:</strong> ${data.phone}</p>
            <p><strong>🏢 Company:</strong> ${data.company}</p>
            <p><strong>⏰ Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          </div>
          <h3>Project Requirements:</h3>
          <div style="background: #fff8e1; padding: 15px; border-left: 4px solid #ffc107;">
            ${data.requirement.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            ✅ Data has been saved to Supabase and Google Sheets automatically.
          </p>
        </div>
      `,
      text: `
        New Client Request: ${data.fullName}
        
        Name: ${data.fullName}
        Email: ${data.email}
        Phone: ${data.phone}
        Company: ${data.company}
        Submitted: ${new Date(data.timestamp).toLocaleString()}
        
        Project Requirements:
        ${data.requirement}
        
        Data has been saved to Supabase and Google Sheets automatically.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to admin');
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}
