import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

    const { data: freelancer } = await supabase.from("freelancers").select("*").eq("id", freelancerId).single()

    if (!freelancer) {
      return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    }

    return NextResponse.json({ freelancer })
  } catch (error) {
    console.error("Get freelancer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
