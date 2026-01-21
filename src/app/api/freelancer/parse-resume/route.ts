import { OpenAIProfileRater, parseResumeToProfile } from "../../../../lib/open-ai-profile-rater"
import { ScrapingService } from "../../../../lib/services/scrapingService"
import { type NextRequest, NextResponse } from "next/server"

// Add validation constants
const MIN_RESUME_TEXT_LENGTH = 50
const MAX_RESUME_TEXT_LENGTH = 50000

// Validate extracted text
function validateResumeText(text: string): { isValid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'No text extracted from resume' }
  }
  
  const trimmedText = text.trim()
  
  if (trimmedText.length < MIN_RESUME_TEXT_LENGTH) {
    return { 
      isValid: false, 
      error: `Resume text too short (${trimmedText.length} chars). Minimum required: ${MIN_RESUME_TEXT_LENGTH}` 
    }
  }
  
  if (trimmedText.length > MAX_RESUME_TEXT_LENGTH) {
    return { 
      isValid: false, 
      error: `Resume text too long (${trimmedText.length} chars). Maximum allowed: ${MAX_RESUME_TEXT_LENGTH}` 
    }
  }
  
  // Check if text contains meaningful content (not just errors or garbage)
  const meaningfulWords = trimmedText.split(/\s+/).filter(word => word.length > 2).length
  if (meaningfulWords < 10) {
    return { 
      isValid: false, 
      error: 'Resume appears to have insufficient meaningful content' 
    }
  }
  
  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    // Set timeout for the entire operation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds timeout

    try {
      // Step 1: Get file URL from request body
      const body = await request.json()
      console.log("📦 Request body received:", { 
        fileUrl: body.fileUrl ? 'Present' : 'Missing',
        fileUrlLength: body.fileUrl?.length || 0,
        freelancerId: body.freelancerId || 'Not provided'
      })

      const fileUrl = body.fileUrl
      const freelancerId = body.freelancerId

      if (!fileUrl) {
        return NextResponse.json({ 
          error: "File URL is required",
          code: "MISSING_FILE_URL" 
        }, { status: 400 })
      }

      // Validate file URL format
      if (!fileUrl.startsWith('http') && !fileUrl.startsWith('blob:')) {
        return NextResponse.json({ 
          error: "Invalid file URL format",
          code: "INVALID_URL_FORMAT" 
        }, { status: 400 })
      }

      // Step 2: Extract text from resume
      console.log("📄 Extracting resume content from URL (first 100 chars):", fileUrl.substring(0, 100) + "...")
      
      const parserService = new ScrapingService()
      
      // Try multiple parsing strategies
      let rawText = ''
      let parsingMethod = 'unknown'
      
      try {
        // First try: Supabase file parsing
        rawText = await (parserService as any).trySupabaseFileParsing(fileUrl)
        parsingMethod = 'supabase'
        

      } catch (parseError) {
        console.error("❌ Primary parsing failed:", parseError)
      }

      // Validate extracted text
      const validation = validateResumeText(rawText)
      if (!validation.isValid) {
        console.error("❌ Resume text validation failed:", validation.error)
        return NextResponse.json({ 
          error: validation.error,
          code: "INVALID_RESUME_CONTENT",
          parsingMethod,
          textSample: rawText.substring(0, 200) + "..."
        }, { status: 400 })
      }

      console.log("📝 Resume parsed successfully:", {
        method: parsingMethod,
        length: rawText.length,
        preview: rawText.substring(0, 200) + "..."
      })

      // Step 3: Convert resume text → structured profile
      console.log("🧩 Converting to structured profile...")
      
      let structuredProfile
      try {
        structuredProfile = await parseResumeToProfile(rawText)
        console.log("✅ Profile structured successfully")
      } catch (profileError) {
        console.error("❌ Profile structuring failed:", profileError)
      }

      // Validate structured profile has minimum data
      if (!structuredProfile || typeof structuredProfile !== 'object') {
        throw new Error("Profile structuring returned invalid result")
      }

      // Ensure required fields exist (with defaults)
      const safeProfile = {
        name: structuredProfile.name || "",
        email: structuredProfile.email || "",
        phone: structuredProfile.phone || "",
        title: structuredProfile.title || "",
        bio: structuredProfile.bio || "",
        skills: Array.isArray(structuredProfile.skills) ? structuredProfile.skills : [],
        experience_years: typeof structuredProfile.experience_years === 'number' 
          ? structuredProfile.experience_years 
          : 0,
        portfolio_url: structuredProfile.portfolio_url || null,
        github_url: structuredProfile.github_url || null,
        linkedin_url: structuredProfile.linkedin_url || null,
        twitter_url: structuredProfile.twitter_url || null,
        education: Array.isArray(structuredProfile.education) ? structuredProfile.education : [],
        graduation_year: structuredProfile.graduation_year || null,
        projects: Array.isArray(structuredProfile.projects) ? structuredProfile.projects : [],
        certifications: Array.isArray(structuredProfile.certifications) 
          ? structuredProfile.certifications 
          : [],
        work_experience: Array.isArray(structuredProfile.work_experience) 
          ? structuredProfile.work_experience 
          : [],
      }

      console.log("📊 Structured Profile Summary:", {
        name: safeProfile.name || "Not found",
        email: safeProfile.email || "Not found",
        skillsCount: safeProfile.skills.length,
        experienceYears: safeProfile.experience_years,
        workExperienceCount: safeProfile.work_experience.length
      })

      // Step 4: Rate structured profile (optional, with fallback)
      console.log("⭐ Calculating profile rating...")
      
      type RatingResult = { rating: number | null; feedback: string[]; analysis: string }
      let ratingResult: RatingResult = { rating: null, feedback: [], analysis: "" }
      try {
        const rater = new OpenAIProfileRater()
        ratingResult = await rater.calculateAverageRating(safeProfile)
        console.log("✅ Rating calculated:", ratingResult.rating)
      } catch (ratingError) {
        console.warn("⚠️ Rating calculation failed, using defaults:", ratingError)
        ratingResult = {
          rating: safeProfile.experience_years > 5 ? 4.0 : 3.0,
          feedback: ["Default rating due to calculation error"],
          analysis: "Rating calculation failed"
        }
      }

      // Step 5: Return full response
      console.log("✅ Successfully parsed & rated resume")

      return NextResponse.json({
        success: true,
        freelancer_id: freelancerId,
        profile: {
          ...safeProfile,
          profile_rating: ratingResult.rating,
          rating_feedback: Array.isArray(ratingResult.feedback) 
            ? ratingResult.feedback 
            : [ratingResult.feedback || ""],
        },
        metadata: {
          parsing_method: parsingMethod,
          text_length: rawText.length,
          processing_time: new Date().toISOString()
        }
      })

    } finally {
      clearTimeout(timeoutId)
    }

  } catch (error: any) {
    console.error("🚨 ERROR in /parse-resume:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    })

    // Handle specific error types
    let statusCode = 500
    let errorCode = "INTERNAL_SERVER_ERROR"
    let errorMessage = "Internal server error"

    if (error.name === 'AbortError') {
      statusCode = 408
      errorCode = "REQUEST_TIMEOUT"
      errorMessage = "Resume processing timed out"
    } else if (error.message?.includes('Failed to parse')) {
      statusCode = 400
      errorCode = "PARSE_ERROR"
      errorMessage = error.message
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      statusCode = 502
      errorCode = "NETWORK_ERROR"
      errorMessage = "Network error occurred while processing resume"
    }

    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    }, { status: statusCode })
  }
}