import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Helper function to parse JSON fields
const parseJsonField = (field: any): any => {
  if (!field) return field === null ? null : []
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return field
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}


// GET: Fetch complete profile
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Parse all JSON fields
    const parsedProfile = {
      ...profile,
      case_studies: parseJsonField(profile.case_studies),
      work_experience: parseJsonField(profile.work_experience),
      testimonials: parseJsonField(profile.testimonials),
      education: parseJsonField(profile.education),
      projects: parseJsonField(profile.projects),
      portfolio_links: parseJsonField(profile.portfolio_links),
      skills: profile.skills || [],
      tools_tech_stack: profile.tools_tech_stack || [],
      languages: profile.languages || [],
      certifications: profile.certifications || [],
      rating_feedback: profile.rating_feedback || [],
    }

    return NextResponse.json({ profile: parsedProfile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT/PATCH: Update profile or specific sections
export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    // Get current profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      )
    }

    let updates: any = {
      updated_at: new Date().toISOString(),
      last_profile_update: new Date().toISOString()
    }

    // Handle different actions
    switch (action) {
      case 'update_profile':
        // Update basic profile fields
        updates = { ...updates, ...data }
        break

      case 'add_work_experience': {
        const workExp = parseJsonField(currentProfile.work_experience)
        const newExp = { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() }
        updates.work_experience = JSON.stringify([...workExp, newExp])
        break
      }

      case 'update_work_experience': {
        const { id, ...expData } = data
        const workExp = parseJsonField(currentProfile.work_experience)
        updates.work_experience = JSON.stringify(
          workExp.map((item: any) => item.id === id ? { ...item, ...expData, updated_at: new Date().toISOString() } : item)
        )
        break
      }

      case 'delete_work_experience': {
        const { id } = data
        const workExp = parseJsonField(currentProfile.work_experience)
        updates.work_experience = JSON.stringify(workExp.filter((item: any) => item.id !== id))
        break
      }

      case 'add_testimonial': {
        const testimonials = parseJsonField(currentProfile.testimonials)
        const newTestimonial = { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() }
        updates.testimonials = JSON.stringify([...testimonials, newTestimonial])
        break
      }

      case 'update_testimonial': {
        const { id, ...testData } = data
        const testimonials = parseJsonField(currentProfile.testimonials)
        updates.testimonials = JSON.stringify(
          testimonials.map((item: any) => item.id === id ? { ...item, ...testData, updated_at: new Date().toISOString() } : item)
        )
        break
      }

      case 'delete_testimonial': {
        const { id } = data
        const testimonials = parseJsonField(currentProfile.testimonials)
        updates.testimonials = JSON.stringify(testimonials.filter((item: any) => item.id !== id))
        break
      }

      case 'add_case_study': {
        const caseStudies = parseJsonField(currentProfile.case_studies)

        const baseSlug = generateSlug(data.title)
        const uniqueSlug = `${baseSlug}-${Date.now()}`

        const newStudy = {
          id: crypto.randomUUID(),
          slug: uniqueSlug, // ✅ ADD THIS
          ...data,
          created_at: new Date().toISOString()
        }

        const updatedStudies = [...caseStudies, newStudy]

        updates.case_studies = JSON.stringify(updatedStudies)
        updates.case_study_count = updatedStudies.length

        const categories = [
          ...new Set(updatedStudies.map((cs: any) => cs.category).filter(Boolean))
        ]
        updates.case_study_categories = categories

        break
      }


      case 'update_case_study': {
        const { id, ...studyData } = data
        const caseStudies = parseJsonField(currentProfile.case_studies)

        const updatedStudies = caseStudies.map((item: any) => {
          if (item.id === id) {
            return {
              ...item,
              ...studyData,
              slug: item.slug || generateSlug(studyData.title) + "-" + Date.now(),
              updated_at: new Date().toISOString()
            }
          }
          return item
        })
        updates.case_studies = JSON.stringify(updatedStudies)

        const categories = [
          ...new Set(updatedStudies.map((cs: any) => cs.category).filter(Boolean))
        ]
        updates.case_study_categories = categories

        break
      }


      case 'delete_case_study': {
        const { id } = data
        const caseStudies = parseJsonField(currentProfile.case_studies)
        const updatedStudies = caseStudies.filter((item: any) => item.id !== id)
        updates.case_studies = JSON.stringify(updatedStudies)
        updates.case_study_count = updatedStudies.length

        // Update categories
        const categories = [...new Set(updatedStudies.map((cs: any) => cs.category).filter(Boolean))]
        updates.case_study_categories = categories
        break
      }

      case 'add_skill': {
        const skills = currentProfile.skills || []
        if (!skills.includes(data.skill)) {
          updates.skills = [...skills, data.skill]
        }
        break
      }

      case 'remove_skill': {
        const skills = currentProfile.skills || []
        updates.skills = skills.filter((s: string) => s !== data.skill)
        break
      }

      case 'add_tool': {
        const tools = currentProfile.tools_tech_stack || []
        if (!tools.includes(data.tool)) {
          updates.tools_tech_stack = [...tools, data.tool]
        }
        break
      }

      case 'remove_tool': {
        const tools = currentProfile.tools_tech_stack || []
        updates.tools_tech_stack = tools.filter((t: string) => t !== data.tool)
        break
      }

      case 'add_language': {
        const languages = currentProfile.languages || []
        if (!languages.includes(data.language)) {
          updates.languages = [...languages, data.language]
        }
        break
      }

      case 'remove_language': {
        const languages = currentProfile.languages || []
        updates.languages = languages.filter((l: string) => l !== data.language)
        break
      }

      case 'add_certification': {
        const certs = currentProfile.certifications || []
        if (!certs.includes(data.certification)) {
          updates.certifications = [...certs, data.certification]
        }
        break
      }

      case 'remove_certification': {
        const certs = currentProfile.certifications || []
        updates.certifications = certs.filter((c: string) => c !== data.certification)
        break
      }

      case 'add_education': {
        const education = parseJsonField(currentProfile.education)
        const newEdu = { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() }
        updates.education = JSON.stringify([...education, newEdu])
        break
      }

      case 'update_education': {
        const { id, ...eduData } = data
        const education = parseJsonField(currentProfile.education)
        updates.education = JSON.stringify(
          education.map((item: any) => item.id === id ? { ...item, ...eduData, updated_at: new Date().toISOString() } : item)
        )
        break
      }

      case 'delete_education': {
        const { id } = data
        const education = parseJsonField(currentProfile.education)
        updates.education = JSON.stringify(education.filter((item: any) => item.id !== id))
        break
      }

      case 'submit_for_review':
        updates.profile_status = 'pending_review'
        updates.review_status = 'pending_review'
        updates.submitted_at = new Date().toISOString()
        break

      default:
        // If no action specified, treat as full profile update
        updates = { ...updates, ...body }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("freelancers")
      .update(updates)
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    // Fetch updated profile
    const { data: updatedProfile, error: refetchError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", user.id)
      .single()

    if (refetchError) {
      return NextResponse.json({ success: true })
    }

    // Parse JSON fields for response
    const parsedProfile = {
      ...updatedProfile,
      case_studies: parseJsonField(updatedProfile.case_studies),
      work_experience: parseJsonField(updatedProfile.work_experience),
      testimonials: parseJsonField(updatedProfile.testimonials),
      education: parseJsonField(updatedProfile.education),
      projects: parseJsonField(updatedProfile.projects),
      portfolio_links: parseJsonField(updatedProfile.portfolio_links),
    }

    return NextResponse.json({
      success: true,
      profile: parsedProfile,
      message: "Profile updated successfully"
    })

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE: Remove specific items or entire profile (with caution)
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { action, id } = await request.json()

    // Get current profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      )
    }

    let updates: any = {
      updated_at: new Date().toISOString(),
      last_profile_update: new Date().toISOString()
    }

    switch (action) {
      case 'delete_account':
        // Actually delete the account (use with caution)
        const { error: deleteError } = await supabase
          .from("freelancers")
          .delete()
          .eq("id", user.id)

        if (deleteError) {
          return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
          )
        }
        return NextResponse.json({
          success: true,
          message: "Account deleted successfully"
        })

      default:
        return NextResponse.json(
          { error: "Invalid delete action" },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error("Profile delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}