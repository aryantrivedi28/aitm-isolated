import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Fetch freelancer if exists
    const { data: freelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.error("⚠️ Error fetching freelancer:", fetchError)
      return NextResponse.json({ error: "Failed to fetch freelancer" }, { status: 500 })
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const timestamp = new Date().toISOString()

    // Insert or Update freelancer OTP
    const upsertData: Record<string, any> = {
      email,
      otp,
      otp_expires_at: otpExpiresAt,
      otp_verified: false,
      updated_at: timestamp,
    }
    
    if (!freelancer) {
      upsertData["name"] = ""
      upsertData["created_at"] = timestamp
      await supabase.from("freelancers").insert([upsertData])
    } else {
      await supabase.from("freelancers").update(upsertData).eq("email", email)
    }

    // Nodemailer config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 587, // secure only if port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send OTP Email
    await transporter.sendMail({
      from: `"Freelance Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Freelancer OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2>Freelancer Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #2563eb;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    console.log(`📧 OTP sent to: ${email}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      isNewUser: !freelancer,
    })
  } catch (error: any) {
    console.error("🔥 OTP Error:", error)
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    )
  }
}
