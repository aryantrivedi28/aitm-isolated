// app/api/otp/verify/route.ts
import { NextResponse } from "next/server"
import { verifyOtp } from "../../../../lib/otpStore"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp) return NextResponse.json({ error: "Email & OTP required" }, { status: 400 })

    const valid = verifyOtp(email, otp)
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("OTP verify error", err)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
