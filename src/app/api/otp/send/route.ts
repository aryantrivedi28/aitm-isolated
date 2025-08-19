// app/api/otp/send/route.ts
import { NextResponse } from "next/server"
import { transporter } from "../../../../lib/mailer"
import { saveOtp } from "../../../../lib/otpStore"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
    saveOtp(email, otp)

    // send email
    await transporter.sendMail({
      from: `"Finzie AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("OTP send error", err)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
