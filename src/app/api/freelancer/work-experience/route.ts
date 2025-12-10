import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get freelancer ID from cookie (reuse your existing function)
async function getFreelancerId() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("freelancer_session")
  if (!sessionCookie?.value) return null
  try {
    const session = JSON.parse(sessionCookie.value)
    return session.id
  } catch {
    return null
  }
}

// Validate work experience
function validateWorkExperience(experience: any): boolean {
  return (
    typeof experience === 'object' &&
    experience !== null &&
    typeof experience.role === 'string' &&
    typeof experience.company === 'string' &&
    typeof experience.start_date === 'string' &&
    typeof experience.is_current === 'boolean' &&
    (experience.end_date === undefined || typeof experience.end_date === 'string') &&
    (experience.location === undefined || typeof experience.location === 'string') &&
    (experience.description === undefined || typeof experience.description === 'string') &&
    (experience.achievements === undefined || Array.isArray(experience.achievements))
  )
}

// GET — Fetch Work Experience
export async function GET() {
  console.log("📌 [API HIT] GET /api/freelancer/work-experience")

  try {
    const freelancerId = await getFreelancerId()
    console.log("👤 Logged-in freelancer ID:", freelancerId)

    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch the profile to get work experience
    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("work_experience")
      .eq("id", freelancerId)
      .single()

    if (error) {
      console.error("❌ Error fetching work experience:", error)
      return NextResponse.json({ error: "Failed to fetch work experience" }, { status: 500 })
    }

    console.log("✅ Work experience fetched successfully")

    return NextResponse.json({
      work_experience: profile.work_experience || []
    })
  } catch (error) {
    console.error("❌ GET Work Experience Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST — Add Work Experience
export async function POST(request: NextRequest) {
  console.log("📌 [API HIT] POST /api/freelancer/work-experience")

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const newExperience = await request.json()
    
    // Validate required fields
    if (!newExperience.role || !newExperience.company || !newExperience.start_date) {
      return NextResponse.json(
        { error: "Role, company, and start date are required" },
        { status: 400 }
      )
    }

    // Validate the experience object
    if (!validateWorkExperience(newExperience)) {
      return NextResponse.json(
        { error: "Invalid work experience structure" },
        { status: 400 }
      )
    }

    // Generate ID and timestamps
    const experienceWithId = {
      id: uuidv4(),
      ...newExperience,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Get current work experience
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("work_experience")
      .eq("id", freelancerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching current profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const currentExperience = currentProfile.work_experience || []
    const updatedExperience = [...currentExperience, experienceWithId]

    // Update work experience in profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update({
        work_experience: updatedExperience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Error updating work experience:", updateError)
      return NextResponse.json({ error: "Failed to add work experience" }, { status: 500 })
    }

    console.log("✅ Work experience added successfully")

    return NextResponse.json({
      success: true,
      work_experience: updatedProfile.work_experience,
      newItem: experienceWithId
    })
  } catch (error) {
    console.error("❌ POST Work Experience Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT — Update Work Experience
export async function PUT(request: NextRequest) {
  console.log("📌 [API HIT] PUT /api/freelancer/work-experience")

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      )
    }

    // Get current work experience
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("work_experience")
      .eq("id", freelancerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching current profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const currentExperience = currentProfile.work_experience || []
    const experienceIndex = currentExperience.findIndex((exp: any) => exp.id === id)

    if (experienceIndex === -1) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      )
    }

    // Update the experience
    const updatedExperience = [...currentExperience]
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Update work experience in profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update({
        work_experience: updatedExperience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Error updating work experience:", updateError)
      return NextResponse.json({ error: "Failed to update work experience" }, { status: 500 })
    }

    console.log("✅ Work experience updated successfully")

    return NextResponse.json({
      success: true,
      work_experience: updatedProfile.work_experience
    })
  } catch (error) {
    console.error("❌ PUT Work Experience Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — Remove Work Experience
export async function DELETE(request: NextRequest) {
  console.log("📌 [API HIT] DELETE /api/freelancer/work-experience")

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      )
    }

    // Get current work experience
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("work_experience")
      .eq("id", freelancerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching current profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const currentExperience = currentProfile.work_experience || []
    const updatedExperience = currentExperience.filter((exp: any) => exp.id !== id)

    // Update work experience in profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update({
        work_experience: updatedExperience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Error deleting work experience:", updateError)
      return NextResponse.json({ error: "Failed to delete work experience" }, { status: 500 })
    }

    console.log("✅ Work experience deleted successfully")

    return NextResponse.json({
      success: true,
      work_experience: updatedProfile.work_experience
    })
  } catch (error) {
    console.error("❌ DELETE Work Experience Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}