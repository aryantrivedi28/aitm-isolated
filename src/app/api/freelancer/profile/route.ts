import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import type { FreelancerProfileData } from "../../../../lib/open-ai-profile-rater"

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

// Portfolio item type
interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  tools: string[]
  category: "tech" | "creative"
  createdAt: string
}

// Work experience type
interface WorkExperience {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

// GET — Fetch Profile
export async function GET() {
  console.log("📌 [API HIT] GET /api/freelancer/profile")

  try {
    const freelancerId = await getFreelancerId()
    console.log("👤 Logged-in freelancer ID:", freelancerId)

    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    console.log("📡 Fetching profile from Supabase...")

    let { data: profile, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", freelancerId)
      .single()

    console.log("📥 Supabase response profile:", profile)
    console.log("⚠️ Supabase error:", error)

    // Seed a default profile if none exists
    if ((error && error.code === "PGRST116") || !profile) {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get("freelancer_session")
      const session = sessionCookie?.value ? JSON.parse(sessionCookie.value) : {}

      const defaultProfile = {
        id: freelancerId,
        email: session.email ?? null,
        name: session.name ?? "",
        title: "",
        bio: "",
        skills: [],
        experience_years: 0,
        availability: "freelance",
        github_url: "",
        portfolio_url: "",
        education: [],
        certifications: [],
        resume_url: "",
        projects: [],
        background_type: "both",
        portfolio_items: [],
        work_experience: [],
        photo_url: DEFAULT_AVATAR,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data: inserted, error: insertError } = await supabase
        .from("freelancers")
        .insert(defaultProfile)
        .select()
        .single()

      if (insertError || !inserted) {
        console.error("❌ Profile seed failed:", insertError)
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }

      profile = inserted
      error = null
    }

    console.log("✅ Sending profile response")

    return NextResponse.json({
      profile: {
        ...profile,
        photo_url: profile.photo_url || DEFAULT_AVATAR,
        background_type: profile.background_type || "both",
        portfolio_items: profile.portfolio_items || [],
        work_experience: profile.work_experience || [],
      },
    })
  } catch (error) {
    console.error("❌ GET Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


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

// Validate portfolio_items
function validatePortfolioItems(items: unknown): items is PortfolioItem[] {
  return (
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as any).id === "string" &&
        typeof (item as any).title === "string" &&
        ["tech", "creative"].includes((item as any).category)
    )
  )
}

// Validate work_experience
function validateWorkExperience(items: unknown): items is WorkExperience[] {
  return (
    Array.isArray(items) &&
    items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as any).id === "string" &&
        typeof (item as any).role === "string" &&
        typeof (item as any).company === "string"
    )
  )
}
// -------------------------------
// PUT — Update Profile (UPDATED)
// -------------------------------
export async function PUT(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const updates = await request.json()

    // 🚫 Protect fields that must NEVER be updated
    const PROTECTED_FIELDS = ["email", "id", "created_at"]

    // Allowed fields (email removed)
    const ALLOWED_FIELDS = [
      "name",
      "phone",
      "title",
      "bio",
      "skills",
      "experience_years",
      "portfolio_url",
      "github_url",
      "linkedin_url",
      "education",
      "certifications",
      "portfolio_items",
      "work_experience",
      "projects",
      "background_type",
      "photo_url",
    ]

    // Filter only allowed + remove protected fields
    const filteredUpdates: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (updates[key] !== undefined) {
        if (!PROTECTED_FIELDS.includes(key)) {
          filteredUpdates[key] = updates[key]
        }
      }
    }

    // 🔐 Ensure email is NEVER included
    if ("email" in filteredUpdates) delete filteredUpdates.email
    if ("email" in updates) console.log("⚠️ Email ignored in payload")

    // Validate background_type
    if (
      filteredUpdates.background_type &&
      !["tech", "creative", "both"].includes(
        filteredUpdates.background_type as string
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid background_type. Must be 'tech', 'creative', or 'both'",
        },
        { status: 400 }
      )
    }

    // Validate portfolio_items
    if (filteredUpdates.portfolio_items !== undefined) {
      if (!validatePortfolioItems(filteredUpdates.portfolio_items)) {
        return NextResponse.json(
          { error: "Invalid portfolio_items structure" },
          { status: 400 }
        )
      }
    }

    // Validate work_experience
    if (filteredUpdates.work_experience !== undefined) {
      if (!validateWorkExperience(filteredUpdates.work_experience)) {
        return NextResponse.json(
          { error: "Invalid work_experience structure" },
          { status: 400 }
        )
      }
    }

    // Timestamp
    filteredUpdates.updated_at = new Date().toISOString()

    // AI Rating
    try {
      const { OpenAIProfileRater } = await import(
        "../../../../lib/open-ai-profile-rater"
      )

      // Transform filteredUpdates to match FreelancerProfileData interface
      const ratingData: FreelancerProfileData = {
        name: (filteredUpdates.name as string) || null,
        phone: (filteredUpdates.phone as string) || null,
        title: (filteredUpdates.title as string) || null,
        bio: (filteredUpdates.bio as string) || null,
        skills: Array.isArray(filteredUpdates.skills) ? (filteredUpdates.skills as string[]) : [],
        experience_years: typeof filteredUpdates.experience_years === "number" ? filteredUpdates.experience_years : null,
        portfolio_url: (filteredUpdates.portfolio_url as string) || null,
        github_url: (filteredUpdates.github_url as string) || null,
        linkedin_url: (filteredUpdates.linkedin_url as string) || null,
        education: Array.isArray(filteredUpdates.education)
          ? (filteredUpdates.education as any[]).map((e) => {
              if (typeof e === "string") {
                try {
                  const parsed = JSON.parse(e)
                  return {
                    degree: parsed.degree || null,
                    institution: parsed.institution || null,
                    year: parsed.year || null,
                  }
                } catch {
                  return { degree: e, institution: null, year: null }
                }
              }
              return {
                degree: e?.degree || null,
                institution: e?.institution || null,
                year: e?.year || null,
              }
            })
          : [],
        certifications: Array.isArray(filteredUpdates.certifications) ? (filteredUpdates.certifications as string[]) : [],
        work_experience: Array.isArray(filteredUpdates.work_experience)
          ? (filteredUpdates.work_experience as any[]).map((exp) => ({
              company: exp?.company || null,
              role: exp?.role || null,
              start_date: exp?.startDate || exp?.start_date || null,
              end_date: exp?.endDate || exp?.end_date || null,
              description: exp?.description || null,
            }))
          : [],
        projects: Array.isArray(filteredUpdates.projects) ? (filteredUpdates.projects as any[]).map((p) => ({
          name: p?.name || null,
          description: p?.description || null,
        })) : [],
      }

      const rater = new OpenAIProfileRater()
      const result = await rater.calculateAverageRating(ratingData)

      filteredUpdates.profile_rating = result.rating
      filteredUpdates.rating_feedback = result.feedback
    } catch (err) {
      console.warn("⚠️ AI Rating skipped:", err)
    }

    // Supabase update
    const { data: updatedProfile, error } = await supabase
      .from("freelancers")
      .update(filteredUpdates)
      .eq("id", freelancerId)
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase update error:", error)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    if (!updatedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        ...updatedProfile,
        photo_url: updatedProfile.photo_url || DEFAULT_AVATAR,
        background_type: updatedProfile.background_type || "both",
        portfolio_items: updatedProfile.portfolio_items || [],
        work_experience: updatedProfile.work_experience || [],
      },
    })
  } catch (error) {
    console.error("❌ PUT Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
