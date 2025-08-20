import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"
import nodemailer from "nodemailer"

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min

    // Store OTP in Supabase
    await supabaseAdmin
      .from("client_table")
      .upsert({ email, otp, expires_at: expiresAt, verified: false })

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    })

    await transporter.sendMail({
      from: `"Finzie AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Send OTP error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
