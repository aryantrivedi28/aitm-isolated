// src/app/api/freelancer/onboarding/score/route.ts

import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // ==============================
    // 📌 FETCH FREELANCER PROFILE
    // ==============================
    const { data: profile, error: profileError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError)
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // ==============================
    // 📌 FETCH CASE STUDIES (NEW TABLE)
    // ==============================
    const { data: caseStudies, error: caseError } = await supabase
      .from("freelancer_case_studies")
      .select("id")
      .eq("freelancer_id", userId)

    if (caseError) {
      console.error("Case study fetch error:", caseError)
    }

    // ==============================
    // 🧠 AI SCORING LOGIC
    // ==============================
    let score = 0
    const maxScore = 100

    // Base completion score
    score += 10

    // Experience
    if (profile.experience_years) {
      score += Math.min(profile.experience_years * 2, 15)
    }

    // Skills
    score += Math.min((profile.skills?.length || 0) * 2, 10)

    // Tools
    score += Math.min((profile.tools_tech_stack?.length || 0) * 1, 10)

    // Portfolio links
    let portfolioCount = 0

    if (profile.portfolio_url) portfolioCount++
    if (profile.github_url) portfolioCount++
    if (profile.linkedin_url) portfolioCount++
    if (profile.twitter_url) portfolioCount++

    if (Array.isArray(profile.portfolio_links)) {
      portfolioCount += profile.portfolio_links.length
    }

    score += Math.min(portfolioCount * 2, 10)

    // Case studies (from new table)
    score += Math.min((caseStudies?.length || 0) * 5, 15)

    // Testimonials (JSONB)
    if (Array.isArray(profile.testimonials)) {
      score += Math.min(profile.testimonials.length * 5, 10)
    }

    // Work experience
    if (Array.isArray(profile.work_experience)) {
      score += Math.min(profile.work_experience.length * 3, 10)
    }

    // Education
    if (Array.isArray(profile.education)) {
      score += Math.min(profile.education.length * 2, 5)
    }

    // Languages
    score += Math.min((profile.languages?.length || 0) * 1, 3)

    // Certifications
    score += Math.min((profile.certifications?.length || 0) * 1, 2)

    // Cap score at max
    score = Math.min(score, maxScore)

    // ==============================
    // 💾 UPDATE PROFILE SCORE
    // ==============================
    const { error: updateError } = await supabase
      .from("freelancers")
      .update({
        profile_rating: score,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Score update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update score" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      score,
      maxScore
    })

  } catch (error) {
    console.error("AI scoring fatal error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
