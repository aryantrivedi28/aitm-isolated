import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

type AIResult = {
  form_name?: string
  form_description?: string
}

export async function POST(req: Request) {

  try {
    const body = await req.json()

    const {
      category,
      subcategory,
      tech_stack,
      tools,
      required_fields,
      custom_questions,
      form_description,
      form_id,
      form_name,
    } = body

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let owner_id: string
    try {
      const session = JSON.parse(sessionCookie.value)
      owner_id = session.id
    } catch {
      return Response.json({ success: false, error: "Invalid session" }, { status: 401 })
    }

    if (!form_id) {
      return Response.json({ success: false, error: "form_id is required" }, { status: 400 })
    }

    const { data: clientData, error: clientError } = await supabase
      .from("client_table")
      .select("id, email, name")
      .eq("id", owner_id)
      .single()

    if (clientError || !clientData) {
      return Response.json({ success: false, error: "Client not found" }, { status: 404 })
    }

    const aiPrompt = `
    Analyze the following job description and suggest:
    1. A concise hiring form name (max 7 words)
    2. A short one-line description of the role.

    Return valid JSON like:
    {
      "form_name": "Frontend Developer Hiring Form",
      "form_description": "Hiring React.js developer for web projects."
    }

    Job Description:
    ${form_description || "No detailed description provided."}
    `

    let aiResult: AIResult = {}

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: aiPrompt }],
        temperature: 0.7,
      })

      const aiText = aiResponse.choices[0]?.message?.content?.trim() || ""

      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0])
      }
    } catch (aiError: any) {
      console.error("[POST /api/client/submit-form] OpenAI generation failed:", aiError.message)
    }

    const insertPayload = [
      {
        form_id,
        form_name: aiResult.form_name || form_name || `${category || "General"} Hiring Request`,
        form_description:
          aiResult.form_description ||
          form_description ||
          `Auto-generated Requests for ${category || "client"} hiring.`,
        industry: "Client Projects",
        category: Array.isArray(category) ? category.join(", ") : category,
        subcategory: Array.isArray(subcategory) ? subcategory.join(", ") : subcategory,
        tech_stack: Array.isArray(tech_stack) ? tech_stack.join(", ") : tech_stack,
        tools: Array.isArray(tools) ? tools.join(", ") : tools,
        required_fields: Array.isArray(required_fields)
          ? required_fields
          : typeof required_fields === "string"
            ? required_fields.split(",").map((s) => s.trim())
            : ["name", "email", "phone", "resume_link"],
        custom_questions: custom_questions || [],
        created_by: "client",
        role: "client",
        owner_id,
        is_active: true,
      },
    ]

    const { data, error } = await supabase.from("forms").insert(insertPayload).select()

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
      return Response.json({ success: false, error: "Form creation returned no data" }, { status: 400 })
    }

    return Response.json({ success: true, data })
  } catch (err: any) {
    console.error("[POST /api/client/submit-form] Caught exception:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
