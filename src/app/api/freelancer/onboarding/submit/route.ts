// app/api/freelancer/onboarding/submit/route.ts

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "../../../../../lib/SupabaseAuthClient"

export async function POST(request: Request) {
      try {
            console.log("🚀 Freelancer Onboarding Submit API Triggered")

            // ==============================
            // 🔐 AUTH CHECK (Custom Cookie)
            // ==============================
            const cookieStore = await cookies()
            const sessionCookie = cookieStore.get("freelancer_session")

            if (!sessionCookie?.value) {
                  console.error("❌ No session cookie found")
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const session = JSON.parse(sessionCookie.value)
            const freelancerId = session.id

            if (!freelancerId) {
                  console.error("❌ Invalid session format")
                  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            console.log("👤 Authenticated Freelancer ID:", freelancerId)



            // ==============================
            // 📩 GET FORM DATA
            // ==============================
            const formData = await request.json()

            if (!formData.name || !formData.primary_category || !formData.experience_years) {
                  return NextResponse.json(
                        { error: "Missing required fields" },
                        { status: 400 }
                  )
            }

            const timestamp = new Date().toISOString()

            const profileData = {
                  name: formData.name,
                  phone: formData.phone || null,
                  title: formData.title || null,
                  bio: formData.bio || null,
                  primary_category: formData.primary_category,
                  subcategory: formData.subcategory || null,
                  experience_years: formData.experience_years,
                  skills: formData.skills || [],
                  tools_tech_stack: formData.tools_tech_stack || [],
                  languages: formData.languages || [],
                  certifications: formData.certifications || [],

                  github_url: formData.github_url || formData.portfolio_links?.github || null,
                  linkedin_url: formData.linkedin_url || formData.portfolio_links?.linkedin || null,
                  twitter_url: formData.twitter_url || formData.portfolio_links?.twitter || null,
                  portfolio_url: formData.portfolio_url || formData.portfolio_links?.website || null,

                  portfolio_links: formData.portfolio_links?.other || [],

                  testimonials: formData.testimonials || [],
                  work_experience: formData.work_experience || [],
                  education: formData.education || [],

                  availability: formData.availability || 'full-time',

                  profile_status: 'pending_review',
                  review_status: 'pending_review',
                  submitted_at: timestamp,
                  updated_at: timestamp,
                  last_profile_update: timestamp,
                  profile_completed: true,
            }


            // ==============================
            // 🔍 CHECK EXISTING PROFILE
            // ==============================
            const { data: existingProfile, error } = await supabase
                  .from("freelancers")
                  .select("id")
                  .eq("id", freelancerId)
                  .maybeSingle()


            let result

            if (existingProfile) {
                  console.log("♻️ Updating existing profile")

                  result = await supabase
                        .from("freelancers")
                        .update(profileData)
                        .eq("id", freelancerId)

            } else {
                  console.log("🆕 Creating new profile")

                  result = await supabase
                        .from("freelancers")
                        .insert([{
                              id: freelancerId,
                              ...profileData,
                              created_at: timestamp
                        }])
            }

            if (result.error) {
                  console.error("❌ Database Error:", result.error)
                  return NextResponse.json(
                        { error: "Failed to save profile" },
                        { status: 500 }
                  )
            }

            console.log("✅ Profile saved successfully")

            // ==============================
            // 🤖 TRIGGER AI SCORING
            // ==============================
            try {
                  await fetch(`${request.headers.get("origin")}/api/freelancer/onboarding/score`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: freelancerId })
                  })

            } catch (err) {
                  console.error("⚠️ AI scoring failed:", err)
            }

            return NextResponse.json({
                  success: true,
                  redirectTo: "/get-hired/freelancer/dashboard"
            })

      } catch (error: any) {
            console.error("🔥 Fatal Error:", error)
            return NextResponse.json(
                  { error: "Internal server error" },
                  { status: 500 }
            )
      }
}
