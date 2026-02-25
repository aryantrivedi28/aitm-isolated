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

    // Validate required fields
    if (!formData.name || !formData.primary_category || !formData.experience_years) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()

    // Parse subcategories (handle both array and string)
    let subcategories: string[] = []
    if (formData.subcategories) {
      if (Array.isArray(formData.subcategories)) {
        subcategories = formData.subcategories
      } else if (typeof formData.subcategories === 'string') {
        try {
          subcategories = JSON.parse(formData.subcategories)
        } catch {
          subcategories = formData.subcategories.split(',').map((s: string) => s.trim())
        }
      }
    }

    // Parse portfolio links
    let otherPortfolioLinks: string[] = []
    if (formData.other_portfolio_links) {
      if (Array.isArray(formData.other_portfolio_links)) {
        otherPortfolioLinks = formData.other_portfolio_links
      } else if (typeof formData.other_portfolio_links === 'string') {
        try {
          otherPortfolioLinks = JSON.parse(formData.other_portfolio_links)
        } catch {
          otherPortfolioLinks = []
        }
      }
    }

    // Parse case studies - NEW STRUCTURE
    let caseStudies: any[] = []
    if (formData.case_studies) {
      if (Array.isArray(formData.case_studies)) {
        caseStudies = formData.case_studies.map((study: any) => ({
          ...study,
          // Ensure metrics array exists and has proper structure
          metrics: Array.isArray(study.metrics) ? study.metrics.map((metric: any) => ({
            label: metric.label || '',
            value: metric.value || 0,
            type: metric.type || 'number',
            trend: metric.trend || null
          })) : [],
          // Ensure technologies array exists
          technologies: Array.isArray(study.technologies) ? study.technologies : [],
          // Ensure tags array exists
          tags: Array.isArray(study.tags) ? study.tags : [],
          // Set default status
          status: study.status || 'draft',
          // Set timestamps
          created_at: study.created_at || timestamp,
          updated_at: timestamp
        }))
      } else if (typeof formData.case_studies === 'string') {
        try {
          caseStudies = JSON.parse(formData.case_studies)
        } catch {
          caseStudies = []
        }
      }
    }

    // Parse testimonials
    let testimonials: any[] = []
    if (formData.testimonials) {
      if (Array.isArray(formData.testimonials)) {
        testimonials = formData.testimonials.map((t: any) => ({
          ...t,
          rating: t.rating || 5,
          date: t.date || timestamp.split('T')[0]
        }))
      } else if (typeof formData.testimonials === 'string') {
        try {
          testimonials = JSON.parse(formData.testimonials)
        } catch {
          testimonials = []
        }
      }
    }

    // Parse work experience
    let workExperience: any[] = []
    if (formData.work_experience) {
      if (Array.isArray(formData.work_experience)) {
        workExperience = formData.work_experience.map((exp: any) => ({
          ...exp,
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
          technologies: Array.isArray(exp.technologies) ? exp.technologies : []
        }))
      } else if (typeof formData.work_experience === 'string') {
        try {
          workExperience = JSON.parse(formData.work_experience)
        } catch {
          workExperience = []
        }
      }
    }

    // Parse education
    let education: any[] = []
    if (formData.education) {
      if (Array.isArray(formData.education)) {
        education = formData.education.map((edu: any) => {
          if (typeof edu === 'string') {
            // Try to parse string education
            return edu
          }
          return {
            degree: edu.degree || '',
            institution: edu.institution || '',
            graduation_year: edu.graduation_year || null,
            field_of_study: edu.field_of_study || '',
            grade: edu.grade || ''
          }
        })
      } else if (typeof formData.education === 'string') {
        try {
          education = JSON.parse(formData.education)
        } catch {
          education = [formData.education]
        }
      }
    }

    // Parse projects
    let projects: any[] = []
    if (formData.projects) {
      if (Array.isArray(formData.projects)) {
        projects = formData.projects
      } else if (typeof formData.projects === 'string') {
        try {
          projects = JSON.parse(formData.projects)
        } catch {
          projects = []
        }
      }
    }

    // Prepare profile data for freelancers table
    const profileData = {
      name: formData.name,
      email: formData.email, // Keep email for reference
      phone: formData.phone || null,
      title: formData.title || null,
      bio: formData.bio || null,
      primary_category: formData.primary_category,
      subcategory: formData.subcategory || null,
      subcategories: subcategories, // Store as array
      experience_years: formData.experience_years,
      skills: formData.skills || [],
      tools_tech_stack: formData.tools_tech_stack || [],
      languages: formData.languages || [],
      certifications: formData.certifications || [],

      // Social/Portfolio links
      github_url: formData.github_url || formData.portfolio_links?.github || null,
      linkedin_url: formData.linkedin_url || formData.portfolio_links?.linkedin || null,
      twitter_url: formData.twitter_url || formData.portfolio_links?.twitter || null,
      portfolio_url: formData.portfolio_url || formData.portfolio_links?.website || null,
      portfolio_links: otherPortfolioLinks, // Store as array

      // Arrays that will be stored as JSONB
      testimonials: testimonials,
      work_experience: workExperience,
      education: education,
      projects: projects,

      // Availability and rates
      availability: formData.availability || 'full-time',
      preferred_project_size: formData.preferred_project_size || null,

      // Status fields
      profile_status: 'pending_review',
      review_status: 'pending_review',
      submitted_at: timestamp,
      updated_at: timestamp,
      last_profile_update: timestamp,
      profile_completed: true,
    }

    console.log("📦 Profile data prepared:", {
      name: profileData.name,
      primary_category: profileData.primary_category,
      subcategories_count: subcategories.length,
      skills_count: profileData.skills.length,
      case_studies_count: caseStudies.length,
      testimonials_count: testimonials.length,
      work_experience_count: workExperience.length
    })

    // ==============================
    // 🔍 CHECK EXISTING PROFILE
    // ==============================
    const { data: existingProfile, error: fetchError } = await supabase
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
        { error: "Failed to save profile: " + result.error.message },
        { status: 500 }
      )
    }

    console.log("✅ Profile saved successfully")

    // ==============================
    // 📊 SAVE CASE STUDIES SEPARATELY
    // ==============================
    if (caseStudies.length > 0) {
      console.log(`📝 Saving ${caseStudies.length} case studies`)

      // First, delete existing case studies (if updating)
      if (existingProfile) {
        await supabase
          .from("freelancer_case_studies")
          .delete()
          .eq("freelancer_id", freelancerId)
      }

      // Insert new case studies
      for (const study of caseStudies) {
        // Generate slug from title
        let slug = study.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Check if slug exists and make it unique
        const { data: existingSlug } = await supabase
          .from("freelancer_case_studies")
          .select("slug")
          .eq("slug", slug)
          .maybeSingle()

        if (existingSlug) {
          slug = `${slug}-${Date.now()}`
        }

        const { error: caseStudyError } = await supabase
          .from("freelancer_case_studies")
          .insert([{
            freelancer_id: freelancerId,
            title: study.title,
            slug: slug,
            short_summary: study.short_summary || study.description || '',
            category: study.category || profileData.primary_category,
            industry: study.industry || '',
            problem_statement: study.problem_statement || '',
            solution_provided: study.solution_provided || '',
            strategy: study.strategy || null,
            implementation: study.implementation || null,
            results_overview: study.results_overview || study.outcome || '',
            metrics: study.metrics || [],
            technologies: study.technologies || [],
            tags: study.tags || [],
            image_url: study.image_url || '',
            gallery_images: study.gallery_images || [],
            project_url: study.project_url || null,
            testimonial: study.testimonial || null,
            status: 'pending', // Requires admin approval
            is_featured: false,
            view_count: 0,
            created_at: timestamp,
            updated_at: timestamp
          }])

        if (caseStudyError) {
          console.error("❌ Error saving case study:", caseStudyError)
        }
      }
    }

    // ==============================
    // 🤖 TRIGGER AI SCORING
    // ==============================
    try {
      const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      const scoringResponse = await fetch(`${origin}/api/freelancer/onboarding/score`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cookie": `freelancer_session=${sessionCookie.value}`
        },
        body: JSON.stringify({ userId: freelancerId })
      })

      if (!scoringResponse.ok) {
        console.error("⚠️ AI scoring failed with status:", scoringResponse.status)
      } else {
        console.log("✅ AI scoring triggered successfully")
      }
    } catch (err) {
      console.error("⚠️ AI scoring error:", err)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Profile submitted successfully",
      redirectTo: "/get-hired/freelancer/dashboard",
      stats: {
        case_studies: caseStudies.length,
        testimonials: testimonials.length,
        work_experience: workExperience.length
      }
    })

  } catch (error: any) {
    console.error("🔥 Fatal Error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error.message || "Unknown error") },
      { status: 500 }
    )
  }
}