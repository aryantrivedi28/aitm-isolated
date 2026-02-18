// app/api/freelancer/score/route.ts
import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    // Get the freelancer profile
    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Calculate AI score
    let score = 0
    const maxScore = 100

    // Base score for completing profile
    score += 10

    // Experience score
    if (profile.experience_years) {
      score += Math.min(profile.experience_years * 2, 15)
    }

    // Skills score
    score += Math.min((profile.skills?.length || 0) * 2, 10)
    score += Math.min((profile.tools_tech_stack?.length || 0) * 1, 10)

    // Portfolio links score
    let portfolioCount = 0
    if (profile.portfolio_url) portfolioCount++
    if (profile.github_url) portfolioCount++
    if (profile.linkedin_url) portfolioCount++
    if (profile.twitter_url) portfolioCount++
    const otherLinks = profile.portfolio_links ? JSON.parse(profile.portfolio_links) : []
    portfolioCount += otherLinks.length
    score += Math.min(portfolioCount * 2, 10)

    // Case studies score
    const caseStudies = profile.case_studies ? JSON.parse(profile.case_studies) : []
    score += Math.min(caseStudies.length * 5, 15)

    // Testimonials score
    const testimonials = profile.testimonials ? JSON.parse(profile.testimonials) : []
    score += Math.min(testimonials.length * 5, 10)

    // Work experience score
    const workExp = profile.work_experience ? JSON.parse(profile.work_experience) : []
    score += Math.min(workExp.length * 3, 10)

    // Education score
    const education = profile.education ? JSON.parse(profile.education) : []
    score += Math.min(education.length * 2, 5)

    // Languages and certifications
    score += Math.min((profile.languages?.length || 0) * 1, 3)
    score += Math.min((profile.certifications?.length || 0) * 1, 2)

    // Update the profile with the AI score
    await supabase
      .from("freelancers")
      .update({ 
        profile_rating: score,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)

    return NextResponse.json({ 
      success: true, 
      score,
      maxScore 
    })

  } catch (error) {
    console.error("AI scoring error:", error)
    return NextResponse.json(
      { error: "Failed to calculate score" },
      { status: 500 }
    )
  }
}