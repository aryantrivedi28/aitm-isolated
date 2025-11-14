import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { OpenAIProfileRater } from "../../../../lib/open-ai-profile-rater"
import { cookies } from "next/headers"

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"

// 🛠️ Helper — Get logged-in freelancer ID
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

// 📌 GET — Fetch Profile
export async function GET() {
  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", freelancerId)
      .single()

    if (error || !profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    return NextResponse.json({
      profile: {
        ...profile,
        photo_url: profile.photo_url || DEFAULT_AVATAR,
      },
    })
  } catch (error) {
    console.error("GET Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// 📌 PUT — Update Profile + Generate Rating
export async function PUT(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const updates = await request.json()
    const timestamp = new Date().toISOString()

    // 🧠 AI Rating
    let profile_rating: number | null = null
    let rating_feedback: string[] = []

    try {
      const rater = new OpenAIProfileRater()
      const result = await rater.calculateAverageRating(updates)
      profile_rating = result.rating
      rating_feedback = result.feedback
    } catch (err) {
      console.warn("⚠️ AI Rating skipped due to error:", err)
    }

    // 🔄 Final update payload
    const updatedFields = {
      ...updates,
      profile_rating,
      rating_feedback,
      updated_at: timestamp,
    }

    const { data: updatedProfile, error } = await supabase
      .from("freelancers")
      .update(updatedFields)
      .eq("id", freelancerId)
      .select()
      .single()

    if (error || !updatedProfile)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })

    return NextResponse.json({
      profile: {
        ...updatedProfile,
        photo_url: updatedProfile.photo_url || DEFAULT_AVATAR,
      },
    })
  } catch (error) {
    console.error("PUT Profile Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
