import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🟢 [API] /api/freelancer/auth/verify-otp called")

  try {
    const { email, otp } = await request.json()
    console.log("📩 Request body:", { email, otp })

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // 🔍 Fetch freelancer
    const { data: freelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError || !freelancer)
      return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })

    // 🧩 Compare OTP
    if (freelancer.otp !== otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })

    // 🕒 Check expiration
    const now = new Date()
    const expiry = freelancer.otp_expires_at ? new Date(freelancer.otp_expires_at) : null
    if (!expiry || expiry.getTime() <= now.getTime())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })

    // ✅ Update verified status
    await supabase
      .from("freelancers")
      .update({
        otp_verified: true,
        otp: null,
        otp_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    // 🧠 Check if profile is complete
    const isProfileComplete =
      freelancer.name &&
      freelancer.name.trim() !== "" &&
      freelancer.profile_completed === true // or check other fields like bio, skills, etc.

    const redirectTo = isProfileComplete
      ? "/get-hired/freelancer/dashboard"
      : "/get-hired/freelancer/onboarding"

    // 🍪 Create session cookie
    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      redirectTo,
    })

    response.cookies.set({
      name: "freelancer_session",
      value: JSON.stringify({
        id: freelancer.id,
        email: freelancer.email,
        name: freelancer.name,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("🔥 Verify OTP error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
