import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log("🟢 [API] /api/freelancer/auth/send-otp called")

  try {
    const { email } = await request.json()
    console.log("📩 Request body:", { email })

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Check if freelancer already exists
    const { data: existingFreelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.error("⚠️ Error fetching freelancer:", fetchError)
      return NextResponse.json({ error: "Database read error" }, { status: 500 })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Insert or update freelancer record
    if (existingFreelancer) {
      await supabase
        .from("freelancers")
        .update({
          otp,
          otp_expires_at: expiresAt,
          otp_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
    } else {
      await supabase.from("freelancers").insert([
        {
          email,
          name: "",
          otp,
          otp_expires_at: expiresAt,
          otp_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }

    // ✅ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: `"Freelance Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Freelancer OTP Code",
      html: `
        <div style="font-family: sans-serif; padding: 16px; line-height: 1.5;">
          <h2>Freelancer Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #2563eb; font-size: 28px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>Thanks,<br/>The Freelance Portal Team</p>
        </div>
      `,
    })

    console.log(`📧 OTP email sent successfully to ${email}`)

    // ✅ Return success
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      isNewUser: !existingFreelancer,
    })
  } catch (error: any) {
    console.error("🔥 Send OTP route crashed:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    )
  }
}
