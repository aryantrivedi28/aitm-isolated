import { OpenAIProfileRater } from "../../../../lib/open-ai-profile-rater"
import { parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
import { ScrapingService } from "../../../../lib/services/scrapingService"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🔍 [DEBUG] Received POST /api/freelancer/parse-resume")

  try {
    // Step 1: Auth check
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")
    console.log("🍪 [DEBUG] Cookie keys:", cookieStore.getAll().map((c) => c.name))
    console.log("🍪 [DEBUG] Freelancer session cookie found:", !!sessionCookie)

    if (!sessionCookie?.value) {
      console.warn("⚠️ [DEBUG] Unauthorized - Missing session cookie")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id
    console.log("👤 [DEBUG] Freelancer session:", session)

    // Step 2: Get file URL
    const body = await request.json()
    const fileUrl = body.fileUrl
    console.log("📎 [DEBUG] File URL:", fileUrl)

    if (!fileUrl) {
      console.warn("⚠️ [DEBUG] Missing fileUrl in request body")
      return NextResponse.json({ error: "File URL is required" }, { status: 400 })
    }

    // Step 3: Extract text from resume
    console.log("🧠 [DEBUG] Starting resume parsing via ScrapingService")
    const parserService = new ScrapingService()
    const rawText = await (parserService as any).trySupabaseFileParsing(fileUrl)

    if (!rawText || typeof rawText !== "string") {
      console.error("❌ [DEBUG] Invalid raw text result from parser:", rawText)
      return NextResponse.json({ error: "Failed to parse resume text" }, { status: 400 })
    }

    console.log("🧠 [DEBUG] Raw resume text length:", rawText.length)

    // Step 4: Convert resume text → structured profile
    console.log("🤖 [DEBUG] Converting resume text into structured profile")
    const structuredProfile = await parseResumeToProfile(rawText)
    console.log("🧩 [DEBUG] Structured profile:", structuredProfile)

    // Step 5: Rate structured profile
    const rater = new OpenAIProfileRater()
    const ratingResult = await rater.calculateAverageRating(structuredProfile)
    console.log("⭐ [DEBUG] Rating result:", ratingResult)

    // Step 6: Return full response
    console.log("✅ [DEBUG] Returning parsed and rated profile")
    return NextResponse.json({
      success: true,
      freelancer_id: freelancerId,
      profile: {
        ...structuredProfile,
        profile_rating: ratingResult.rating,
        rating_feedback: ratingResult.feedback,
      },
    })
  } catch (error: any) {
    console.error("💥 [Resume Parse] Error:", error.message || error)
    console.error("📚 [DEBUG] Stack:", error.stack)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
