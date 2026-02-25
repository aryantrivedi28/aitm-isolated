import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log("🚀 OTP API Called")

  try {
    const body = await request.json()
    console.log("📥 Request Body:", body)

    const { email } = body

    if (!email) {
      console.log("❌ Email missing in request")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("📧 Processing email:", email)

    // Fetch freelancer
    console.log("🔍 Checking if freelancer exists...")
    const { data: freelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch freelancer" }, { status: 500 })
    }

    console.log("✅ Freelancer fetch result:", freelancer)

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const timestamp = new Date().toISOString()

    console.log("🔐 Generated OTP:", otp)
    console.log("⏳ OTP Expires At:", otpExpiresAt)

    const upsertData: Record<string, any> = {
      email,
      otp,
      otp_expires_at: otpExpiresAt,
      otp_verified: false,
      updated_at: timestamp,
    }

    let dbResponse

    if (!freelancer) {
      console.log("🆕 Inserting new freelancer")

      upsertData["name"] = ""
      upsertData["created_at"] = timestamp

      dbResponse = await supabase.from("freelancers").insert([upsertData])
    } else {
      console.log("♻️ Updating existing freelancer")

      dbResponse = await supabase
        .from("freelancers")
        .update(upsertData)
        .eq("email", email)
    }

    if (dbResponse.error) {
      console.error("❌ Database update failed:", dbResponse.error)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }

    console.log("✅ Database operation successful")

    // SMTP Debug
    console.log("📨 Creating SMTP transporter...")
    console.log("SMTP HOST:", process.env.SMTP_HOST)
    console.log("SMTP PORT:", process.env.SMTP_PORT)
    console.log("SMTP USER:", process.env.SMTP_USER ? "✔ Loaded" : "❌ Missing")
    console.log("SMTP PASS:", process.env.SMTP_PASS ? "✔ Loaded" : "❌ Missing")

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: true,
    })

    console.log("📤 Sending OTP email...")

    const mailResponse = await transporter.sendMail({
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

    console.log("✅ Email sent successfully")
    console.log("📬 Mail Response:", mailResponse)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      isNewUser: !freelancer,
    })

  } catch (error: any) {
    console.error("🔥 Server Error:", error)
    console.error("🔥 Error Message:", error?.message)
    console.error("🔥 Error Stack:", error?.stack)

    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 },
    )
  }
}