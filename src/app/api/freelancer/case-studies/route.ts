// app/api/freelancer/case-studies/route.ts

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

async function getFreelancerId() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("freelancer_session")

  if (!sessionCookie?.value) {
    console.error("❌ No freelancer_session cookie found")
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session.id
  } catch (err) {
    console.error("❌ Error parsing freelancer_session cookie:", err)
    return null
  }
}

function generateSlug(title: string) {
  return `${title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${uuidv4().slice(0, 6)}`
}

/* ===========================
   GET — All Case Studies
=========================== */

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("freelancer_case_studies")
      .select(`
        id,
        title,
        description,
        slug,
        category,
        outcome,
        technologies,
        image_url,
        project_url,
        created_at,
        freelancers ( name )
      `)

    if (error) {
      console.error("❌ GET Case Studies Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      caseStudies: data.map(cs => ({
        id: cs.id,
        title: cs.title,
        description: cs.description,
        slug: cs.slug,
        category: cs.category,
        outcome: cs.outcome,
        technologies: cs.technologies,
        imageUrl: cs.image_url,
        projectUrl: cs.project_url,
        createdAt: cs.created_at,
        freelancerName: cs.freelancers?.[0]?.name || "Unknown",
        source: "freelancer"
      }))
    })


  } catch (err) {
    console.error("❌ GET API Crash:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/* ===========================
   POST — Create
=========================== */

export async function POST(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()

    if (!freelancerId) {
      console.error("❌ Unauthorized POST attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("📥 POST Body:", body)

    if (!body.title || !body.description || !body.category) {
      console.error("❌ Missing required fields")
      return NextResponse.json(
        { error: "Title, description, and category required" },
        { status: 400 }
      )
    }

    const slug = generateSlug(body.title)

    const { data, error } = await supabase
      .from("freelancer_case_studies")
      .insert([{
        freelancer_id: freelancerId,
        slug,
        title: body.title.trim(),
        description: body.description.trim(),
        category: body.category
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-"),
        outcome: body.outcome || null,
        technologies: body.technologies || [],
        image_url: body.image_url || null,
        project_url: body.project_url || null,
      }])
      .select()
      .single()

    if (error) {
      console.error("❌ POST Insert Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Case Study Created:", data)

    return NextResponse.json({ success: true, caseStudy: data })

  } catch (err) {
    console.error("❌ POST API Crash:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/* ===========================
   PUT — UPDATE Case Study
=========================== */

export async function PUT(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()

    if (!freelancerId) {
      console.error("❌ Unauthorized PUT attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("📥 PUT Body:", body)

    if (!body.id) {
      console.error("❌ Missing case study ID")
      return NextResponse.json(
        { error: "Case study ID required" },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.title) {
      updateData.title = body.title.trim()
      updateData.slug = generateSlug(body.title)
    }

    if (body.description) updateData.description = body.description.trim()
    if (body.category) updateData.category = body.category
    if (body.outcome !== undefined)
      updateData.outcome = body.outcome

    if (body.technologies !== undefined && Array.isArray(body.technologies)) {
      updateData.technologies = body.technologies
    }
    if (body.project_url !== undefined) updateData.project_url = body.project_url

    const { data, error } = await supabase
      .from("freelancer_case_studies")
      .update(updateData)
      .eq("id", body.id)
      .eq("freelancer_id", freelancerId)
      .select()
      .single()

    if (error) {
      console.error("❌ PUT Update Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Case Study Updated:", data)

    return NextResponse.json({ success: true, caseStudy: data })

  } catch (err) {
    console.error("❌ PUT API Crash:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/* ===========================
   DELETE
=========================== */

export async function DELETE(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()

    if (!freelancerId) {
      console.error("❌ Unauthorized DELETE attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await request.json()
    console.log("🗑 DELETE ID:", id)

    const { error } = await supabase
      .from("freelancer_case_studies")
      .delete()
      .eq("id", id)
      .eq("freelancer_id", freelancerId)

    if (error) {
      console.error("❌ DELETE Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Case Study Deleted:", id)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("❌ DELETE API Crash:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
