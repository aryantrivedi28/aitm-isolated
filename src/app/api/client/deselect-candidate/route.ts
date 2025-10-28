import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { submission_id } = await req.json()

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
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("freelancer_submissions")
      .update({
        is_selected: false,
        selection_notes: null,
        selection_date: null,
        selected_by: null,
      })
      .eq("id", submission_id)
      .select()

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: "Candidate deselected successfully",
      submission: data?.[0],
    })
  } catch (err: any) {
    console.error("Error in deselect-candidate route:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
