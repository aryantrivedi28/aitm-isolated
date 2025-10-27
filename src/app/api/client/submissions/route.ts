// app/api/client/submissions/route.ts
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function GET(req: Request) {

  try {
    const { searchParams } = new URL(req.url)
    const client_id = searchParams.get("client_id")

    if (!client_id) {
      return Response.json({ success: false, error: "client_id missing" }, { status: 400 })
    }

    const { data: forms, error: formsError } = await supabase
      .from("forms")
      .select("id, form_name")
      .eq("owner_id", client_id)


    if (formsError) {
      throw new Error(formsError.message)
    }

    if (!forms || forms.length === 0) {
      return Response.json({ success: true, submissions: [] })
    }

    const formIds = forms.map((form) => form.id)
    // Get submissions for all forms owned by this client - INCLUDING is_selected field
    // app/api/client/submissions/route.ts - Update the submissions query
    // Get submissions for all forms owned by this client - INCLUDING is_selected field
    const { data: submissions, error: subsError } = await supabase
      .from("freelancer_submissions")
      .select(`
    id,
    form_id,
    name,
    email,
    phone,
    portfolio_link,
    github_link,
    resume_link,
    years_experience,
    proposal_link,
    created_at,
    custom_responses,
    profile_rating,
    updated_at,
    is_selected,
    selection_notes,
    selection_date,
    selected_by
  `)
      .in("form_id", formIds)
      .order("profile_rating", { ascending: false, nullsFirst: false }) // Sort by rating descending
      .order("created_at", { ascending: false }) // Then by submission date

    console.log("[submissions.route] submissions result:", {
      submissionsCount: submissions?.length || 0,
      subsError,
    })
    if (subsError) {
      throw new Error(subsError.message)
    }

    // Normalize the data to match frontend expectations
    const normalized = (submissions || []).map((sub) => {
      const form = forms.find((f) => f.id === sub.form_id)
      return {
        id: sub.id,
        form_id: sub.form_id,
        name: sub.name, // Changed from candidate_name to name to match frontend
        email: sub.email,
        phone: sub.phone,
        portfolio_link: sub.portfolio_link,
        github_link: sub.github_link,
        resume_link: sub.resume_link,
        years_experience: sub.years_experience,
        proposal_link: sub.proposal_link,
        created_at: sub.created_at,
        custom_responses: sub.custom_responses,
        profile_rating: sub.profile_rating,
        updated_at: sub.updated_at,
        is_selected: sub.is_selected || false,
        selection_notes: sub.selection_notes,
        selection_date: sub.selection_date,
        selected_by: sub.selected_by,
        job_title: form?.form_name || "Untitled Job",
        note: sub.custom_responses?.note || null,
        submitted_at: sub.created_at,
        status: "new",
      }
    })
    return Response.json({ success: true, submissions: normalized })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}