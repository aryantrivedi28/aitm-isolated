import { supabase } from "../../../../lib/SupabaseAuthClient"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

type AIResult = {
  form_name?: string
  form_description?: string
}

export async function POST(req: Request) {
  console.log("[POST /api/client/submit-form] Request received")

  try {
    const body = await req.json()
    console.log("[POST /api/client/submit-form] Parsed request body:", body)

    const {
      category,
      subcategory,
      tech_stack,
      tools,
      required_fields,
      custom_questions,
      owner_id,
      form_description,
      form_id,
      form_name,
    } = body

    if (!owner_id) {
      console.error("[POST /api/client/submit-form] Missing owner_id in request body")
      return Response.json({ success: false, error: "owner_id is required" }, { status: 400 })
    }

    if (!form_id) {
      console.error("[POST /api/client/submit-form] Missing form_id in request body")
      return Response.json({ success: false, error: "form_id is required" }, { status: 400 })
    }

    // ✅ Verify client exists
    const { data: clientData, error: clientError } = await supabase
      .from("client_table")
      .select("id, email, name")
      .eq("id", owner_id)
      .single()

    if (clientError || !clientData) {
      console.error("[POST /api/client/submit-form] Client not found:", clientError)
      return Response.json({ success: false, error: "Client not found" }, { status: 404 })
    }

    console.log("[POST /api/client/submit-form] Client verified:", clientData.email)

    // ✅ Use OpenAI to generate a better form name + description
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

      // Safely parse JSON (OpenAI may sometimes return extra text)
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0])
      }

      console.log("[POST /api/client/submit-form] AI-generated result:", aiResult)
    } catch (aiError: any) {
      console.error("[POST /api/client/submit-form] OpenAI generation failed:", aiError.message)
    }

    // ✅ Prepare insert payload
    const insertPayload = [
      {
        form_id,
        form_name:
          aiResult.form_name ||
          form_name ||
          `${category || "General"} Hiring Request`,
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

    console.log("[POST /api/client/submit-form] Inserting payload:", insertPayload)

    // ✅ Insert into Supabase
    const { data, error } = await supabase.from("forms").insert(insertPayload).select()

    if (error) {
      console.error("[POST /api/client/submit-form] Supabase insert error:", error)
      return Response.json({ success: false, error: error.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
      console.error("[POST /api/client/submit-form] No data returned from insert")
      return Response.json({ success: false, error: "Form creation returned no data" }, { status: 400 })
    }

    console.log("[POST /api/client/submit-form] Form created successfully:", data[0].id)

    return Response.json({ success: true, data })
  } catch (err: any) {
    console.error("[POST /api/client/submit-form] Caught exception:", err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
