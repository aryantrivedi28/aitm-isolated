import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { name, company_name, website, industry, phone } = body

    if (!name || !company_name || !website || !industry || !phone) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let client_id: string
    try {
      const session = JSON.parse(sessionCookie.value)
      client_id = session.id
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid session format" }, { status: 400 })
    }

    if (!client_id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from("client_table")
      .update({ name, company_name, website, industry, phone })
      .eq("id", client_id)
      .select("*")
      .single()

    if (error) {
      console.error("❌ Supabase update error:", error)
      throw error
    }

    return NextResponse.json({ success: true, client: data })
  } catch (err: any) {
    console.error("🔥 Unexpected error:", err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 400 })
  }
}
