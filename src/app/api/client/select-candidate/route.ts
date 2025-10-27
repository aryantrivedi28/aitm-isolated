import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function POST(req: Request) {
  console.log("[POST /api/client/select-candidate] Request received")

  try {
    const body = await req.json()
    const { submission_id, client_id, notes } = body

    if (!submission_id || !client_id) {
      return Response.json(
        { success: false, error: "Missing submission_id or client_id" },
        { status: 400 }
      )
    }

    // ✅ Update freelancer submission record
    const { data, error } = await supabase
      .from("freelancer_submissions")
      .update({
        is_selected: true,
        selected_by: client_id,
      })
      .eq("id", submission_id)
      .select()

    if (error) {
      console.error("[select-candidate] Supabase update error:", error)
      return Response.json({ success: false, error: error.message }, { status: 400 })
    }

    console.log("[select-candidate] Candidate marked as selected:", data)

    return Response.json({
      success: true,
      message: "Candidate selected successfully",
      data,
    })
  } catch (err: any) {
    console.error("[select-candidate] Exception:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
