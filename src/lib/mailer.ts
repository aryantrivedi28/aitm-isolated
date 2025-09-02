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

