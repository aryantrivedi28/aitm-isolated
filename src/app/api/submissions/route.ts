import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase-admin"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      form_id,
      name,
      email,
      phone,
      portfolio_link,
      github_link,
      resume_link,
      years_experience,
      proposal_link,
      custom_responses,
    } = body

    // Validate required fields (minimal: form_id, name, email)
    if (!form_id || !name || !email) {
      return NextResponse.json({ error: "Missing required fields: form_id, name, email" }, { status: 400 })
    }

    // Fetch the client form
    let formQuery = supabaseAdmin.from("forms").select("*")
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(form_id)
    formQuery = isUUID ? formQuery.eq("id", form_id) : formQuery.eq("form_id", form_id)

    const { data: form, error: formError } = await formQuery.single()

    if (formError) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.is_active) {
      return NextResponse.json({ error: "Form submissions are closed" }, { status: 403 })
    }

    // Build submission data
    const submissionData: any = {
      form_id: form.id, // Use the actual form UUID, not the custom form_id
      name,
      email,
      phone: phone || null,
      portfolio_link: portfolio_link || null,
      github_link: github_link || null,
      resume_link: resume_link || null,
      years_experience: years_experience ? Number(years_experience) : null,
      proposal_link: proposal_link || null,
      custom_responses: custom_responses || {},
      profile_rating: null,
    }

    const { data: insertedSubmission, error: insertError } = await supabaseAdmin
      .from("freelancer_submissions")
      .insert([submissionData])
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Build AI prompt including dynamic required fields and form description
    const clientRequirements = {
      category: form.category,
      subcategory: form.subcategory,
      tech_stack: form.tech_stack,
      tools: form.tools,
      required_fields: form.required_fields,
      custom_questions: form.custom_questions,
      description: form.form_description || "",
    }

    console.log("[v0] Client Requirements:", clientRequirements)

    const aiPrompt = `
You are an AI evaluator for a client hiring platform.
Evaluate the freelancer's profile according to the client requirements.

Client Requirements: ${JSON.stringify(clientRequirements, null, 2)}

Freelancer Submission: ${JSON.stringify(submissionData, null, 2)}

Instructions:
- Consider only the required_fields defined in the client form.
- Evaluate skills, experience, and relevance to the client requirements.
- Return only JSON: {"profile_rating": number between 1-10}
`

    // Call OpenAI
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: aiPrompt }],
    })

    // Safely parse AI response
    let profileRating = 1
    try {
      let aiMessage = aiRes.choices[0].message?.content || ""
      aiMessage = aiMessage.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(aiMessage)
      profileRating = Math.max(1, Math.min(10, parsed.profile_rating || 1))
    } catch (err) {
      profileRating = 1
    }

    // Update submission with profile rating
    const { data: updatedSubmission, error: updateError } = await supabaseAdmin
      .from("freelancer_submissions")
      .update({ profile_rating: profileRating })
      .eq("id", insertedSubmission.id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      throw updateError
    }

    return NextResponse.json({ submission: updatedSubmission, success: true })
  } catch (err: any) {
    console.error("[v0] Error creating submission:", err)
    return NextResponse.json({ error: err.message || "Failed to create submission" }, { status: 500 })
  }
}
