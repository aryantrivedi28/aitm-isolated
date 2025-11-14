import { OpenAIProfileRater } from "../../../../lib/open-ai-profile-rater"
import { parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
import { ScrapingService } from "../../../../lib/services/scrapingService"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

  try {
    // Step 1: Auth check
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

    // Step 2: Get file URL
    const body = await request.json()
    const fileUrl = body.fileUrl

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 })
    }

    // Step 3: Extract text from resume
    const parserService = new ScrapingService()
    const rawText = await (parserService as any).trySupabaseFileParsing(fileUrl)

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json({ error: "Failed to parse resume text" }, { status: 400 })
    }


    // Step 4: Convert resume text → structured profile
    const structuredProfile = await parseResumeToProfile(rawText)

    // Step 5: Rate structured profile
    const rater = new OpenAIProfileRater()
    const ratingResult = await rater.calculateAverageRating(structuredProfile)

    // Step 6: Return full response
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
