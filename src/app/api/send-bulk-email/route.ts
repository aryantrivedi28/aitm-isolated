// src/app/api/send-bulk-email/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { freelancers, message } = await req.json()

    if (!freelancers?.length || !message) {
      return NextResponse.json({ error: "Missing freelancers or message" }, { status: 400 })
    }

    // setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // send mail to each freelancer
    const results = await Promise.allSettled(
      freelancers.map((freelancer: any) =>
        transporter.sendMail({
          from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.MAIL_USER}>`,
          to: freelancer.email,
          subject: "New Opportunity from Finzie",
          text: message,
        })
      )
    )

    const successCount = results.filter(r => r.status === "fulfilled").length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: freelancers.length - successCount,
    })
  } catch (err: any) {
    console.error("Bulk Email Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
