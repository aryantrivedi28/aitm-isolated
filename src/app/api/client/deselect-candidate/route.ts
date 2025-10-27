// app/api/client/deselect-candidate/route.ts
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function POST(req: Request) {
  try {
    const { submission_id, client_id } = await req.json()

    if (!submission_id || !client_id) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Update the submission to mark as not selected
    const { data, error } = await supabase
      .from("freelancer_submissions")
      .update({
        is_selected: false,
        selection_notes: null,
        selection_date: null,
        selected_by: null
      })
      .eq("id", submission_id)
      .select()

    if (error) {
      console.error("Error deselecting candidate:", error)
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: "Candidate deselected successfully",
      submission: data?.[0]
    })

  } catch (err: any) {
    console.error("Error in deselect-candidate route:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}