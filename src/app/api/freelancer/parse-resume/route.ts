import { OpenAIProfileRater, parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
import { ScrapingService } from "../../../../lib/services/scrapingService"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Step 1: Get file URL from request body
    const body = await request.json()

    const fileUrl = body.fileUrl
    const freelancerId = body.freelancerId

    if (!fileUrl) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 })
    }

    // Step 2: Extract text from resume
    console.log("📄 Extracting resume content from:", fileUrl)
    
    const parserService = new ScrapingService()
    const rawText = await (parserService as any).trySupabaseFileParsing(fileUrl)

    if (!rawText || typeof rawText !== "string") {
      console.error("❌ Failed to extract resume text")
      return NextResponse.json({ error: "Failed to parse resume text" }, { status: 400 })
    }

    console.log("📝 RAW TEXT (first 500 chars):", rawText.slice(0, 500) + "....")

    // Step 3: Convert resume text → structured profile
    const structuredProfile = await parseResumeToProfile(rawText)
    console.log("🧩 Structured Profile:", structuredProfile)

    // Step 4: Rate structured profile
    const rater = new OpenAIProfileRater()
    const ratingResult = await rater.calculateAverageRating(structuredProfile)
    console.log("⭐ Rating Result:", ratingResult)

    // Step 5: Return full response
    console.log("✅ Successfully parsed & rated")

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
    console.error("🚨 ERROR in /parse-resume:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 })
  }
}