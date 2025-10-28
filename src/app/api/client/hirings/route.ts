import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let client_id: string
    try {
      const session = JSON.parse(sessionCookie.value)
      client_id = session.id
    } catch {
      return Response.json({ success: false, error: "Invalid session" }, { status: 401 })
    }

    if (!client_id) {
      return Response.json({ success: false, error: "client_id missing" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("owner_id", client_id)
      .order("created_at", { ascending: false })

    if (error) return Response.json({ success: false, error: error.message })

    return Response.json({ success: true, forms: data })
  } catch (err: any) {
    console.error("[hirings] Error:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
