import { generateText } from "ai"
import { openai } from "@ai-sdk/openai" // ✅ Use direct OpenAI provider

// -------------------------------
// TYPE DEFINITIONS
// -------------------------------

export interface FreelancerProject {
  name: string
  description?: string
}

export interface FreelancerProfileData {
  name?: string
  title?: string
  bio?: string
  skills?: string[]
  experience_years?: number
  portfolio_url?: string
  github_url?: string
  education?: string[]
  certifications?: string[]
  hourly_rate?: number | null
  projects?: FreelancerProject[]
}

// -------------------------------
// PROFILE RATER CLASS
// -------------------------------

export class OpenAIProfileRater {
  /**
   * Evaluates a freelancer profile and returns a rating, feedback, and analysis.
   */
  async calculateAverageRating(
    profileData: FreelancerProfileData
  ): Promise<{ rating: number; feedback: string[]; analysis: string }> {
    try {
      const prompt = this.buildPrompt(profileData)

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        temperature: 0.5,
        maxOutputTokens: 1000,
        prompt,
      })

      const result = this.parseResponse(text)
      return result
    } catch (error) {
      console.error("[OpenAI Profile Rater] Error:", error)
      return {
        rating: 5,
        feedback: ["Unable to rate profile at this time"],
        analysis: "Rating unavailable due to parsing or API error.",
      }
    }
  }

  /**
   * Builds a structured evaluation prompt.
   */
  private buildPrompt(data: FreelancerProfileData): string {
    return `
You are an expert freelancer profile evaluator. Analyze the profile below and respond ONLY with valid JSON.

Profile Data:
- Name: ${data.name || "Not provided"}
- Title: ${data.title || "Not provided"}
- Bio: ${data.bio || "Not provided"}
- Skills: ${data.skills?.join(", ") || "Not provided"}
- Experience Years: ${data.experience_years ?? "Not provided"}
- Hourly Rate: ${data.hourly_rate ? "$" + data.hourly_rate : "Not provided"}
- Portfolio: ${data.portfolio_url || "Not provided"}
- GitHub: ${data.github_url || "Not provided"}
- Education: ${data.education?.join(", ") || "Not provided"}
- Certifications: ${data.certifications?.join(", ") || "Not provided"}
- Projects: ${
      data.projects?.map((p) => p.name || "Unnamed").join(", ") || "Not provided"
    }

Evaluation Criteria:
1. Profile completeness and clarity
2. Experience depth and relevance
3. Skills quality and modernity
4. Communication quality (bio, tone)
5. Professional presentation (links, structure)
6. Specialization or niche value

Respond ONLY in this JSON structure (no markdown, no commentary):

{
  "rating": <number 1–10>,
  "feedback": [<list of concrete improvement points>],
  "analysis": "<short paragraph with summary>"
}
`
  }

  /**
   * Parses AI response and validates JSON structure.
   */
  private parseResponse(text: string): {
    rating: number
    feedback: string[]
    analysis: string
  } {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("No valid JSON in response")

      const parsed = JSON.parse(jsonMatch[0])

      return {
        rating: Math.max(1, Math.min(10, parsed.rating || 5)),
        feedback: Array.isArray(parsed.feedback)
          ? parsed.feedback
          : ["No feedback provided"],
        analysis: parsed.analysis || "No analysis provided",
      }
    } catch (err) {
      console.error("[Profile Rater] Parse error:", err)
      return {
        rating: 5,
        feedback: ["Failed to interpret AI rating output."],
        analysis: "AI output could not be parsed into valid JSON.",
      }
    }
  }
}

// -------------------------------
// RESUME PARSER FUNCTION
// -------------------------------

export async function parseResumeToProfile(resumeText: string): Promise<FreelancerProfileData> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 0.2,
      maxOutputTokens: 1200,
      prompt: `
You are a professional resume parser. Convert the following resume text into a well-structured JSON profile.

Resume text:
"""
${resumeText.slice(0, 8000)}
"""

Extract and format the following fields as accurately as possible:
{
  "name": string,
  "title": string,
  "bio": string,
  "skills": string[],
  "experience_years": number,
  "portfolio_url": string,
  "github_url": string,
  "education": string[],
  "certifications": string[],
  "projects": [{"name": string, "description": string}],
  "hourly_rate": number | null
}

Return ONLY valid JSON with no commentary.
`,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found in AI response")

    const parsed = JSON.parse(jsonMatch[0])

    // Normalize some values
    return {
      name: parsed.name?.trim() || "",
      title: parsed.title?.trim() || "",
      bio: parsed.bio?.trim() || "",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience_years: Number(parsed.experience_years) || 0,
      portfolio_url: parsed.portfolio_url || "",
      github_url: parsed.github_url || "",
      education: Array.isArray(parsed.education) ? parsed.education : [],
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
        : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      hourly_rate:
        typeof parsed.hourly_rate === "number"
          ? parsed.hourly_rate
          : Number(parsed.hourly_rate) || null,
    }
  } catch (error) {
    console.error("[parseResumeToProfile] Error:", error)
    return {
      name: "",
      title: "",
      bio: "",
      skills: [],
      experience_years: 0,
      portfolio_url: "",
      github_url: "",
      education: [],
      certifications: [],
      projects: [],
      hourly_rate: null,
    }
  }
}
