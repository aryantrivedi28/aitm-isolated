import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { submission_id, notes } = body

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

    if (!submission_id || !client_id) {
      return Response.json({ success: false, error: "Missing submission_id or client_id" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("freelancer_submissions")
      .update({
        is_selected: true,
        selected_by: client_id,
      })
      .eq("id", submission_id)
      .select()

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 })
    }

    return Response.json({
      success: true,
      message: "Candidate selected successfully",
      data,
    })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
