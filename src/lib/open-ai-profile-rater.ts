import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// -------------------------------
// TYPE DEFINITIONS
// -------------------------------

export interface FreelancerProject {
  name: string | null
  description?: string | null
}

export interface WorkExperience {
  company: string | null
  role: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
}

export interface EducationEntry {
  degree: string | null
  institution: string | null
  year: string | null
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
  linkedin_url: string | null
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
      const prompt = this.buildPrompt(profileData)

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        temperature: 0.4,
        maxOutputTokens: 900,
        prompt,
      })

      return this.parseResponse(text)
    } catch (error) {
      console.error("[OpenAI Profile Rater] Error:", error)
      return {
        rating: 5,
        feedback: ["AI evaluation unavailable"],
        analysis: "Error parsing evaluation result.",
      }
    }
  }

  private buildPrompt(data: FreelancerProfileData): string {
    return `
Evaluate this freelancer profile and respond ONLY with valid JSON:

Name: ${data.name}
Title: ${data.title}
Bio: ${data.bio}
Skills: ${data.skills.join(", ")}
Experience: ${data.experience_years}
Portfolio: ${data.portfolio_url}
GitHub: ${data.github_url}
Education: ${data.education.map((e) => e.degree).join(", ")}
Projects: ${data.projects.map((p) => p.name).join(", ")}

Respond using ONLY this structure:

{
  "rating": <number 1 to 10>,
  "feedback": [ "short actionable improvement point" ],
  "analysis": "short explanation"
}`
  }

  private parseResponse(text: string) {
    try {
      const clean = text.trim().replace(/```json|```/g, "")
      const json = JSON.parse(clean)

      return {
        rating: Math.max(1, Math.min(10, json.rating ?? 5)),
        feedback: json.feedback ?? ["No feedback provided"],
        analysis: json.analysis ?? "No analysis provided",
      }
    } catch (e) {
      console.error("Rating Parse Error:", e)
      return {
        rating: 5,
        feedback: ["Invalid response from evaluator"],
        analysis: "Parsing failed",
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
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 0.1,
      maxOutputTokens: 2000,
      prompt: `
You are an expert Resume Parser. Parse the raw input text extracted from a resume.

Resume:
"""
${resumeText.slice(0, 9000)}
"""

Return ONLY valid JSON with this EXACT structure:

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
  "education": [
    {
      "degree": string | null,
      "institution": string | null,
      "year": string | null
    }
  ],
  "certifications": string[],
  "projects": [
    {
      "name": string | null,
      "description": string | null
    }
  ],
  "work_experience": [
    {
      "company": string | null,
      "role": string | null,
      "start_date": string | null,
      "end_date": string | null,
      "description": string | null
    }
  ]
}

No markdown, no commentary.
`
    })

    const clean = text.trim().replace(/```json|```/g, "")
    const parsed = JSON.parse(clean)

    return {
      name: parsed.name ?? null,
      email: parsed.email ?? null,
      phone: parsed.phone ?? null,
      title: parsed.title ?? null,
      bio: parsed.bio ?? null,
      skills: parsed.skills ?? [],
      experience_years: parsed.experience_years ?? null,
      portfolio_url: parsed.portfolio_url ?? null,
      github_url: parsed.github_url ?? null,
      linkedin_url: parsed.linkedin_url ?? null,
      education: Array.isArray(parsed.education) ? parsed.education : [],
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
        : [],
      work_experience: Array.isArray(parsed.work_experience)
        ? parsed.work_experience
        : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    }
  } catch (error) {
    console.error("[parseResumeToProfile Error]:", error)
    return {
      name: null,
      email: null,
      phone: null,
      title: null,
      bio: null,
      skills: [],
      experience_years: null,
      portfolio_url: null,
      github_url: null,
      linkedin_url: null,
      education: [],
      certifications: [],
      work_experience: [],
      projects: [],
    }
  }
}
