// app/api/freelancer/case-studies/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ unwrap params
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

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
      .eq("slug", slug)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ caseStudy: data })

  } catch (err) {
    console.error("❌ API Crash:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
