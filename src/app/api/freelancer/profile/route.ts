import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { OpenAIProfileRater } from "../../../../lib/open-ai-profile-rater"

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" // fallback image if no photo

// 🟢 GET — Fetch Freelancer Profile + Image
export async function GET(request: NextRequest) {
  console.log("📥 [DEBUG] GET /api/freelancer/profile called")

  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      console.warn("⚠️ [DEBUG] Missing freelancer_session cookie")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (e) {
              console.error("⚠️ [DEBUG] Cookie set error:", e)
            }
          },
        },
      }
    )

    // Fetch full freelancer profile
    const { data: profile, error } = await supabase
      .from("freelancers")
      .select("*")
      .eq("id", freelancerId)
      .single()


    // 🖼️ Generate valid image URL
    let photoUrl = profile?.photo_url || null
    if (!photoUrl) {
      console.log("ℹ️ [DEBUG] No photo_url found in profile — using default avatar")
      photoUrl = DEFAULT_AVATAR
    }
    console.log("✅ [DEBUG] Fetched profile photo", photoUrl)

    return NextResponse.json({
      profile: {
        ...profile,
        photo_url: photoUrl,
      },
    })
  } catch (error) {
    console.error("🔥 [DEBUG] Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// 🟢 PUT — Update Freelancer Profile + Rating
export async function PUT(request: NextRequest) {
  console.log("📤 [DEBUG] PUT /api/freelancer/profile called")

  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      console.warn("⚠️ [DEBUG] Missing freelancer_session cookie")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id
    const updates = await request.json()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (e) {
              console.error("⚠️ [DEBUG] Cookie set error:", e)
            }
          },
        },
      }
    )

    // 🧠 Prepare data for AI rating
    const profileForRating = {
      name: updates.name,
      title: updates.title,
      bio: updates.bio,
      skills: updates.skills,
      experience_years: updates.experience_years,
      portfolio_url: updates.portfolio_url,
      github_url: updates.github_url,
      education: updates.education,
      certifications: updates.certifications,
      hourly_rate: updates.hourly_rate,
      projects: updates.projects,
    }

    let ratingData: { profile_rating: number | null; rating_feedback: any[] } = {
      profile_rating: null,
      rating_feedback: [],
    }

    try {
      const rater = new OpenAIProfileRater()
      const ratingResult = await rater.calculateAverageRating(profileForRating)
      ratingData = {
        profile_rating: ratingResult.rating,
        rating_feedback: ratingResult.feedback,
      }
      console.log("[Profile Update] ✅ Rating calculated:", ratingData)
    } catch (ratingError) {
      console.error("[Profile Update] ⚠️ Rating calculation error:", ratingError)
    }

    const updatedFields = {
      ...updates,
      ...ratingData,
      updated_at: new Date().toISOString(),
    }

    // 🧾 Verify freelancer exists
    const { data: existingFreelancer } = await supabase
      .from("freelancers")
      .select("id")
      .eq("id", freelancerId)
      .single()

    if (!existingFreelancer) {
      return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    }

    // 📝 Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("freelancers")
      .update(updatedFields)
      .eq("id", freelancerId)
      .select()
      .single()

    if (updateError) {
      console.error("[Profile Update] ❌ Supabase update error:", updateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    // 🖼️ Attach photo URL (default if missing)
    const finalProfile = {
      ...updatedProfile,
      photo_url: updatedProfile.photo_url || DEFAULT_AVATAR,
    }

    console.log("✅ [Profile Update] Successfully updated profile for:", freelancerId)

    return NextResponse.json({ profile: finalProfile })
  } catch (error) {
    console.error("🔥 [DEBUG] Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
