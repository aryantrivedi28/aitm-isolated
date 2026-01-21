import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// -------------------------------
// TYPE DEFINITIONS
// -------------------------------

export interface FreelancerProject {
  name: string | null
  description?: string | null
  url?: string | null
}

export interface WorkExperience {
  company: string | null
  role: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  current: boolean | null
  location?: string | null
}

export interface EducationEntry {
  degree: string | null
  institution: string | null
  year: string | null
  field?: string | null
}

export interface FreelancerProfileData {
  name: string | null
  email: string | null
  phone: string | null
  title: string | null
  bio: string | null
  skills: string[]
  experience_years: number | null
  portfolio_url: string | null
  github_url: string | null
  graduation_year: string | null
  
  linkedin_url: string | null
  twitter_url: string | null
  education: EducationEntry[]
  certifications: string[]
  work_experience: WorkExperience[]
  projects: FreelancerProject[]
}

// -------------------------------
// PROFILE RATER CLASS
// -------------------------------

export class OpenAIProfileRater {
  async calculateAverageRating(
    profileData: FreelancerProfileData
  ): Promise<{ rating: number; feedback: string[]; analysis: string }> {
    try {
      // If profile is too empty, return default rating
      if (!profileData.name || profileData.skills.length === 0) {
        return {
          rating: 3.0,
          feedback: ["Profile needs more detailed information"],
          analysis: "Insufficient data for accurate rating"
        }
      }

      const prompt = this.buildPrompt(profileData)

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        temperature: 0.3,
        maxOutputTokens: 800,
        prompt,
      })

      return this.parseResponse(text)
    } catch (error) {
      console.error("[OpenAI Profile Rater] Error:", error)
      // Calculate fallback rating based on available data
      const fallbackRating = this.calculateFallbackRating(profileData)
      return {
        rating: fallbackRating,
        feedback: ["AI evaluation temporarily unavailable. Using basic scoring."],
        analysis: "Default rating applied due to technical issues.",
      }
    }
  }

  private calculateFallbackRating(profile: FreelancerProfileData): number {
    let score = 3.0 // Base score
    
    // Add points for completeness
    if (profile.name) score += 0.5
    if (profile.email) score += 0.5
    if (profile.skills.length >= 5) score += 1.0
    if (profile.experience_years && profile.experience_years >= 3) score += 1.0
    if (profile.work_experience.length >= 2) score += 1.0
    if (profile.education.length >= 1) score += 0.5
    if (profile.portfolio_url || profile.github_url) score += 0.5
    
    // Cap at 10
    return Math.min(10, Math.max(1, score))
  }

  private buildPrompt(data: FreelancerProfileData): string {
    const profileSummary = `
Name: ${data.name || "Not provided"}
Title: ${data.title || "Not provided"}
Experience: ${data.experience_years || 0} years
Skills: ${data.skills.slice(0, 20).join(", ") + (data.skills.length > 20 ? "..." : "")}
Education: ${data.education.map(e => e.degree).filter(Boolean).join(", ") || "Not provided"}
Work History: ${data.work_experience.length} positions
Projects: ${data.projects.length} projects
Portfolio: ${data.portfolio_url || "Not provided"}
GitHub: ${data.github_url || "Not provided"}
Certifications: ${data.certifications.length} certifications
`

    return `
You are a professional freelancer profile evaluator. Analyze this profile and provide a rating from 1-10.

${profileSummary}

Consider these factors:
1. Skills relevance and specificity (20%)
2. Work experience depth and progression (25%)
3. Education and certifications (15%)
4. Portfolio/project quality (20%)
5. Overall completeness and presentation (20%)

Respond with ONLY valid JSON:

{
  "rating": <number from 1 to 10 with one decimal>,
  "feedback": [ "short specific actionable improvement suggestion" ],
  "analysis": "brief explanation of the rating"
}

Rating guidelines:
- 1-3: Basic/beginner profile, needs significant work
- 4-6: Average profile, room for improvement
- 7-8: Good profile, above average
- 9-10: Excellent, professional profile

Be constructive and specific in feedback.`
  }

  private parseResponse(text: string) {
    try {
      const clean = text.trim().replace(/```json|```/g, "")
      const json = JSON.parse(clean)

      // Validate and sanitize rating
      let rating = parseFloat(json.rating)
      if (isNaN(rating)) rating = 5.0
      rating = Math.max(1, Math.min(10, rating))
      
      // Ensure feedback is an array
      const feedback = Array.isArray(json.feedback) 
        ? json.feedback.slice(0, 3) // Limit to 3 suggestions
        : [json.feedback || "Keep improving your profile"]

      return {
        rating,
        feedback,
        analysis: json.analysis || "No detailed analysis provided",
      }
    } catch (e) {
      console.error("Rating Parse Error:", e, "Raw text:", text.substring(0, 200))
      return {
        rating: 5.0,
        feedback: ["Could not parse AI evaluation"],
        analysis: "Parsing error occurred",
      }
    }
  }
}

// -------------------------------
// RESUME PARSER FUNCTION
// -------------------------------

export async function parseResumeToProfile(
  resumeText: string
): Promise<FreelancerProfileData> {
  try {
    // Clean and truncate text appropriately
    const cleanedText = resumeText.replace(/\s+/g, ' ').trim()
    const maxLength = 12000
    const truncatedText = cleanedText.length > maxLength 
      ? cleanedText.substring(0, maxLength) + "... [truncated]"
      : cleanedText

    console.log(`[parseResumeToProfile] Processing ${cleanedText.length} chars, truncated to ${truncatedText.length}`)

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 0.1,
      maxOutputTokens: 2500,
      prompt: `
You are an expert Resume Parser. Parse the following resume text into a structured JSON format.

IMPORTANT INSTRUCTIONS:
1. Extract ALL available information
2. Parse dates in YYYY-MM format when possible (e.g., "2020-03" for March 2020)
3. For current positions, set end_date to null and current to true
4. Extract email addresses from contact information
5. Estimate experience_years from work history if not explicitly stated
6. Include LinkedIn, Twitter, and other social URLs if found
7. For skills, include both hard and soft skills mentioned
8. For projects, include any URLs mentioned
9. If information is not found, use null for strings, [] for arrays, 0 for numbers

Resume Text:
"""
${truncatedText}
"""

Return ONLY valid JSON with this EXACT structure (all fields required):

{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "title": string | null,
  "bio": string | null,
  "skills": string[],
  "experience_years": number | null,
  "portfolio_url": string | null,
  "github_url": string | null,
  "linkedin_url": string | null,
  "twitter_url": string | null,
  "education": [
    {
      "degree": string | null,
      "institution": string | null,
      "year": string | null,
      "field": string | null
    }
  ],
  "certifications": string[],
  "projects": [
    {
      "name": string | null,
      "description": string | null,
      "url": string | null
    }
  ],
  "work_experience": [
    {
      "company": string | null,
      "role": string | null,
      "start_date": string | null,
      "end_date": string | null,
      "current": boolean | null,
      "location": string | null,
      "description": string | null
    }
  ]
}

Do not include any markdown formatting, only pure JSON.`
    })

    console.log("[parseResumeToProfile] Raw AI response received, length:", text.length)

    const clean = text.trim()
    // Extract JSON from response
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? jsonMatch[0] : clean
    
    let parsed
    try {
      parsed = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("[parseResumeToProfile] JSON parse error, attempting cleanup:", parseError instanceof Error ? parseError.message : String(parseError))
      // Try to fix common JSON issues
      const fixedJson = jsonText
        .replace(/(\w+):/g, '"$1":') // Add quotes to keys
        .replace(/'/g, '"') // Replace single quotes
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
      
      try {
        parsed = JSON.parse(fixedJson)
      } catch (secondError) {
        console.error("[parseResumeToProfile] Second parse attempt failed")
        throw new Error(`Failed to parse AI response as JSON: ${secondError instanceof Error ? secondError.message : String(secondError)}`)
      }
    }

    // Validate and normalize the parsed data
    return normalizeProfileData(parsed)

  } catch (error) {
    console.error("[parseResumeToProfile Error]:", error)
    // Return minimal profile instead of completely empty
    return getMinimalProfile(resumeText)
  }
}





/* =========================================================
   NORMALIZATION & HELPERS
========================================================= */

function normalizeProfileData(parsed: any): FreelancerProfileData {
  const experienceYears =
    typeof parsed.experience_years === "number"
      ? parsed.experience_years
      : estimateExperience(parsed.work_experience)

  return {
    name: parsed?.name ?? null,
    email: parsed?.email ?? extractEmail(parsed),
    phone: parsed?.phone ?? null,
    title: parsed?.title ?? "Freelancer",
    bio: parsed?.bio ?? null,
    skills: Array.isArray(parsed?.skills) ? parsed.skills : [],
    experience_years: experienceYears,
    graduation_year: parsed?.graduation_year ?? null,
    portfolio_url: parsed?.portfolio_url ?? null,
    github_url: parsed?.github_url ?? null,
    linkedin_url: parsed?.linkedin_url ?? null,
    twitter_url: parsed?.twitter_url ?? null,
    education: Array.isArray(parsed?.education)
      ? parsed.education.map(mapEducation)
      : [],
    certifications: Array.isArray(parsed?.certifications)
      ? parsed.certifications
      : [],
    work_experience: Array.isArray(parsed?.work_experience)
      ? parsed.work_experience.map(mapWork)
      : [],
    projects: Array.isArray(parsed?.projects)
      ? parsed.projects.map(mapProject)
      : [],
  }
}

function mapEducation(e: any): EducationEntry {
  return {
    degree: e?.degree ?? null,
    institution: e?.institution ?? null,
    year: e?.year ?? null,
    field: e?.field ?? null,
  }
}

function mapWork(w: any): WorkExperience {
  return {
    company: w?.company ?? null,
    role: w?.role ?? null,
    start_date: w?.start_date ?? null,
    end_date: w?.end_date ?? null,
    current:
      w?.current === true ||
      w?.end_date === null ||
      /present|current/i.test(w?.end_date ?? ""),
    location: w?.location ?? null,
    description: w?.description ?? null,
  }
}

function mapProject(p: any): FreelancerProject {
  return {
    name: p?.name ?? null,
    description: p?.description ?? null,
    url: p?.url ?? null,
  }
}

function estimateExperience(work: any[]): number {
  if (!Array.isArray(work)) return 0
  const years = new Set<number>()
  work.forEach(w => {
    if (w?.start_date) {
      const y = Number(w.start_date.slice(0, 4))
      if (!isNaN(y)) years.add(y)
    }
  })
  return years.size
}

function extractEmail(data: unknown): string | null {
  const text = JSON.stringify(data)
  const match = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  )
  return match ? match[0] : null
}

function getMinimalProfile(resumeText: string): FreelancerProfileData {
  return {
    name: null,
    email: extractEmail(resumeText),
    phone: null,
    title: "Freelancer",
    bio: "Profile created from resume upload",
    skills: [],
    experience_years: 0,
    portfolio_url: null,
    github_url: null,
    graduation_year: null,
    linkedin_url: null,
    twitter_url: null,
    education: [],
    certifications: [],
    work_experience: [],
    projects: [],
  }
}

/* =========================================================
   RATING HELPERS
========================================================= */

function calculateFallbackRating(profile: FreelancerProfileData): number {
  let score = 3
  if (profile.skills.length >= 5) score += 2
  if (profile.work_experience.length >= 2) score += 2
  if (profile.portfolio_url || profile.github_url) score += 1
  return Math.min(10, score)
}

function parseRatingResponse(text: string) {
  const clean = text.replace(/```json|```/g, "")
  const json = JSON.parse(clean)

  return {
    rating: Math.min(10, Math.max(1, Number(json.rating) || 5)),
    feedback: Array.isArray(json.feedback) ? json.feedback : [],
    analysis: json.analysis ?? "",
  }
}

/* =========================================================
   PROMPTS
========================================================= */

function buildRatingPrompt(p: FreelancerProfileData): string {
  return `
Evaluate this freelancer profile and return ONLY JSON.

Name: ${p.name}
Title: ${p.title}
Experience: ${p.experience_years} years
Skills: ${p.skills.join(", ")}
Projects: ${p.projects.length}
Work Experience: ${p.work_experience.length}

Return format:
{
  "rating": number,
  "feedback": string[],
  "analysis": string
}
`
}

function buildResumeParserPrompt(text: string): string {
  return `
You are an expert resume parser.

Resume:
"""
${text}
"""

Return ONLY valid JSON matching the required structure.
`
}