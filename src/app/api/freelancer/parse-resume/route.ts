// import { OpenAIProfileRater, parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
// import { ScrapingService } from "../../../../lib/services/scrapingService"
// import { cookies } from "next/headers"
// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {

//   console.log("🚀 [API HIT] /api/freelancer/parse-resume")

//   try {
//     // Step 1: Auth check
//     const cookieStore = await cookies()
//     // const sessionCookie = cookieStore.get("freelancer_session")
//     // console.log("🔐 Cookie Found:", sessionCookie?.value)

//     if (!sessionCookie?.value) {
//       console.warn("❌ Unauthorized: Missing freelancer_session cookie")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     let session
//     try {
//       session = JSON.parse(sessionCookie.value)
//     } catch {
//       console.error("⚠️ Failed to parse session cookie JSON")
//       return NextResponse.json({ error: "Invalid session format" }, { status: 400 })
//     }

//     const freelancerId = session.id
//     console.log("🆔 Freelancer ID:", freelancerId)

//     // Step 2: Get file URL
//     const body = await request.json()
//     console.log("📩 Request Body:", body)

//     const fileUrl = body.fileUrl
//     console.log("📎 File URL:", fileUrl)

//     if (!fileUrl) {
//       console.warn("⚠️ File URL Missing")
//       return NextResponse.json({ error: "File URL is required" }, { status: 400 })
//     }

//     // Step 3: Extract text from resume
//     console.log("📄 Extracting resume content from:", fileUrl)
    
//     const parserService = new ScrapingService()
//     const rawText = await (parserService as any).trySupabaseFileParsing(fileUrl)

//     if (!rawText || typeof rawText !== "string") {
//       console.error("❌ Failed to extract resume text")
//       return NextResponse.json({ error: "Failed to parse resume text" }, { status: 400 })
//     }

//     console.log("📝 RAW TEXT (first 500 chars):", rawText.slice(0, 500) + "....")

//     // Step 4: Convert resume text → structured profile
//     const structuredProfile = await parseResumeToProfile(rawText)
//     console.log("🧩 Structured Profile:", structuredProfile)

//     // Step 5: Rate structured profile
//     const rater = new OpenAIProfileRater()
//     const ratingResult = await rater.calculateAverageRating(structuredProfile)
//     console.log("⭐ Rating Result:", ratingResult)

//     // Step 6: Return full response
//     console.log("✅ Successfully parsed & rated")

//     return NextResponse.json({
//       success: true,
//       freelancer_id: freelancerId,
//       profile: {
//         ...structuredProfile,
//         profile_rating: ratingResult.rating,
//         rating_feedback: ratingResult.feedback,
//       },
//     })

//   } catch (error: any) {
//     console.error("🚨 ERROR in /parse-resume:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



import { OpenAIProfileRater, parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
import { ScrapingService } from "../../../../lib/services/scrapingService"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🚀 [API HIT] /api/freelancer/parse-resume")

  try {
    // Step 1: Get file URL from request body
    const body = await request.json()
    console.log("📩 Request Body:", body)

    const fileUrl = body.fileUrl
    const freelancerId = body.freelancerId // Optional: for tracking
    console.log("📎 File URL:", fileUrl)
    console.log("🆔 Freelancer ID (optional):", freelancerId)

    if (!fileUrl) {
      console.warn("⚠️ File URL Missing")
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