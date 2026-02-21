import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()

    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }


    // Fetch freelancer
    const { data: freelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch freelancer" }, { status: 500 })
    }


    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const timestamp = new Date().toISOString()


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

      dbResponse = await supabase
        .from("freelancers")
        .update(upsertData)
        .eq("email", email)
    }

    if (dbResponse.error) {
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }


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


    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      isNewUser: !freelancer,
    })

  } catch (error: any) {

    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 },
    )
  }
}
