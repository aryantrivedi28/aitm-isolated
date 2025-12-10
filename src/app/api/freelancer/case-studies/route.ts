// app/api/freelancer/case-studies/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get freelancer ID from cookie
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

// Valid categories for case studies (matching frontend)
const VALID_CATEGORIES = [
  'marketing',
  'social-media-marketing',
  'seo-content',
  'email-crm',
  'influencer-partnerships',
  'brand-creative-strategy',
  'analytics-data',
  'growth-gtm',
  'gohighlevel',
  'shopify',
  'fractional-cmo',
  'video-editing',
  'creatives',
  'ui-ux-design',
  'website-development',
  'no-code-automation',
]

// Validate case study
function validateCaseStudy(caseStudy: any): boolean {
  return (
    typeof caseStudy === 'object' &&
    caseStudy !== null &&
    typeof caseStudy.title === 'string' &&
    caseStudy.title.trim().length > 0 &&
    typeof caseStudy.description === 'string' &&
    caseStudy.description.trim().length > 0 &&
    typeof caseStudy.category === 'string' &&
    VALID_CATEGORIES.includes(caseStudy.category)
  )
}

// GET — Fetch Case Studies
export async function GET() {

  try {
    const freelancerId = await getFreelancerId()
    console.log("👤 Logged-in freelancer ID:", freelancerId)

    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch the profile to get case studies
    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("case_studies, case_study_categories")
      .eq("id", freelancerId)
      .single()

    if (error) {
      console.error("❌ Error fetching case studies:", error)
      return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 })
    }


    return NextResponse.json({
      case_studies: profile.case_studies || [],
      categories: profile.case_study_categories || []
    })
  } catch (error) {
    console.error("❌ GET Case Studies Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST — Add Case Study
export async function POST(request: NextRequest) {

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const newCaseStudy = await request.json()
    
    // Validate required fields
    if (!newCaseStudy.title || !newCaseStudy.description || !newCaseStudy.category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      )
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(newCaseStudy.category)) {
      return NextResponse.json(
        { 
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate the case study object
    if (!validateCaseStudy(newCaseStudy)) {
      return NextResponse.json(
        { error: "Invalid case study structure" },
        { status: 400 }
      )
    }

    // Generate ID and timestamps
    const caseStudyWithId = {
      id: uuidv4(),
      ...newCaseStudy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Get current case studies and categories
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("case_studies, case_study_categories")
      .eq("id", freelancerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching current profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const currentCaseStudies = currentProfile.case_studies || []
    const currentCategories = currentProfile.case_study_categories || []
    
    // Add new case study
    const updatedCaseStudies = [...currentCaseStudies, caseStudyWithId]
    
    // Update categories if not already included
    let updatedCategories = [...currentCategories]
    if (!updatedCategories.includes(newCaseStudy.category)) {
      updatedCategories.push(newCaseStudy.category)
    }

    // Update case studies and categories
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update({
        case_studies: updatedCaseStudies,
        case_study_categories: updatedCategories,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Error adding case study:", updateError)
      return NextResponse.json({ error: "Failed to add case study" }, { status: 500 })
    }


    return NextResponse.json({
      success: true,
      case_studies: updatedProfile.case_studies,
      categories: updatedProfile.case_study_categories,
      newItem: caseStudyWithId
    })
  } catch (error) {
    console.error("❌ POST Case Study Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — Remove Case Study
export async function DELETE(request: NextRequest) {
  console.log("📌 [API HIT] DELETE /api/freelancer/case-studies")

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Case study ID is required" },
        { status: 400 }
      )
    }

    // Get current case studies and categories
    const { data: currentProfile, error: fetchError } = await supabase
      .from("freelancers")
      .select("case_studies, case_study_categories")
      .eq("id", freelancerId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching current profile:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const currentCaseStudies = currentProfile.case_studies || []
    const caseStudyToDelete = currentCaseStudies.find((item: any) => item.id === id)

    if (!caseStudyToDelete) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      )
    }

    // Remove the case study
    const updatedCaseStudies = currentCaseStudies.filter((item: any) => item.id !== id)

    // Update categories - remove if category is no longer used
    const currentCategories = currentProfile.case_study_categories || []
    const deletedCategory = caseStudyToDelete.category
    
    // Check if category is still used by other case studies
    const categoryStillUsed = updatedCaseStudies.some((item: any) => item.category === deletedCategory)
    
    let updatedCategories = [...currentCategories]
    if (!categoryStillUsed) {
      updatedCategories = updatedCategories.filter((cat: string) => cat !== deletedCategory)
    }

    // Update case studies and categories
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update({
        case_studies: updatedCaseStudies,
        case_study_categories: updatedCategories,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("❌ Error deleting case study:", updateError)
      return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
    }

    console.log("✅ Case study deleted successfully")

    return NextResponse.json({
      success: true,
      case_studies: updatedProfile.case_studies,
      categories: updatedProfile.case_study_categories
    })
  } catch (error) {
    console.error("❌ DELETE Case Study Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}