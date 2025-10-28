import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie) {
      return NextResponse.json({ exists: false }, { status: 200 })
    }

    let client_id: string
    let email: string
    try {
      const session = JSON.parse(sessionCookie.value)
      client_id = session.id
      email = session.email
    } catch {
      return NextResponse.json({ exists: false }, { status: 200 })
    }

    const { data, error } = await supabaseAdmin
      .from("client_table")
      .select("id, email, name, company_name, website, industry, phone")
      .eq("id", client_id)
      .single()

    if (error || !data) {
      return NextResponse.json({ exists: false }, { status: 200 })
    }

    const requiredFields = ["name", "company_name", "website", "industry", "phone"]
    const isComplete = requiredFields.every((field) => (data as any)[field] && (data as any)[field] !== "")

    if (!isComplete) {
      return NextResponse.json({ exists: false, client: data }, { status: 200 })
    }

    return NextResponse.json({ exists: true, client: data })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
