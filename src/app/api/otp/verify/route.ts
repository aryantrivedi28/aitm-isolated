import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    const { data, error } = await supabaseAdmin
      .from("client_table")
      .select("otp, expires_at")
      .eq("email", email)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 })
    }

    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    if (data.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // ✅ Mark as verified
    await supabaseAdmin.from("client_table").update({ verified: true }).eq("email", email)

    // ✅ Set cookie for auth (httpOnly so frontend can't tamper with it)
    const res = NextResponse.json({ success: true })
    res.cookies.set(
      "client_auth",
      JSON.stringify({ email }), // <-- this is key
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      }
    )


    return res
  } catch (err: any) {
    console.error("Verify OTP error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
