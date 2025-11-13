import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle cookie setting errors
            }
          },
        },
      },
    )

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
