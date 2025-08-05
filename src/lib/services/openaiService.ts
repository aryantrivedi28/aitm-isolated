import OpenAI from "openai"
import { CONFIG } from "../config"
import { FallbackRatingService } from "./fallbackRatingService"
import type { FreelancerData, AIAnalysisResult } from "../../types/freelancer"

export class OpenAIService {
  private openai: OpenAI
  private fallbackService: FallbackRatingService

  constructor() {
    this.openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY })
    this.fallbackService = new FallbackRatingService()
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.openai.models.list()
      return true
    } catch (error) {
      console.error("OpenAI testConnection failed:", error)
      return false
    }
  }

  async analyzeFreelancer(candidateData: FreelancerData): Promise<AIAnalysisResult> {
    const MAX_TRIES = 3
    const RETRY_DELAY = 2000 // 2 seconds

    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      try {
        console.log(`🤖 Running DevOps analysis for candidate...`)
        const sanitizedContent = {
          resume: (candidateData.resumeContent || "").slice(0, 2000),
          portfolio: (candidateData.portfolioContent || "").slice(0, 1500),
          proposal: (candidateData.proposalContent || "").slice(0, 1000),
        }

        const prompt = this.buildDevOpsPrompt({
          ...candidateData,
          resumeContent: sanitizedContent.resume,
          portfolioContent: sanitizedContent.portfolio,
          proposalContent: sanitizedContent.proposal,
        })

        const completion = await this.openai.chat.completions.create({
          model: CONFIG.OPENAI_MODEL,
          messages: [
            {
              role: "system",
              content: "You are a DevOps hiring assistant. Score candidates fairly based on experience and skills.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: CONFIG.OPENAI_MAX_TOKENS,
          temperature: CONFIG.OPENAI_TEMPERATURE,
        })

        const response = completion.choices[0].message.content || ""
        return this.parseDevOpsResponse(response)
      } catch (error: any) {
        console.warn(`❌ Attempt ${attempt} failed: ${error.message}`)
        if (attempt === MAX_TRIES) {
          console.warn("❌ All retries failed. Falling back to local analysis.")
          return this.fallbackService.analyzeFreelancer(candidateData)
        }
        await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt)) // exponential backoff
      }
    }

    return { rating: 0, review: "Unexpected error in analysis flow." }
  }

  private buildDevOpsPrompt(data: FreelancerData): string {
    return `
You are a senior DevOps hiring analyst for a product company. You must be FAIR and REALISTIC in scoring.

**Candidate Profile:**
Name: ${data.name}
GitHub: ${data.github || "Not provided"}
Portfolio: ${data.portfolioContent || "No portfolio provided"}
Resume: ${data.resumeContent || "No resume provided"}
Proposal: ${data.proposalContent || "No proposal provided"}

**Scoring Rules:**
• Each of the 9 skill signals must be rated 0–10
• Add up all scores to get TOTAL_SCORE (0–90)
• Final VERDICT: Strong (70+), Moderate (45–69), Weak (<45)
• REVIEW: 1 sentence summary of candidate's strength or weakness

**Signals to Score:**
1. Release Pipelines & CI/CD
2. Cloud Architecture
3. Infrastructure as Code
4. Containerization
5. Observability (Monitoring, Logging)
6. Security / DevSecOps
7. Programming / Scripting
8. Collaboration & Ownership
9. Years of Experience

**Response Format (strict):**
{
  "SIGNAL_1": number,
  "SIGNAL_2": number,
  ...
  "SIGNAL_9": number,
  "TOTAL_SCORE": number,
  "VERDICT": "Strong" | "Moderate" | "Weak",
  "REVIEW": "One sentence only"
}
    `.trim()
  }

  private parseDevOpsResponse(response: string): AIAnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("No JSON detected in response")

      const parsed = JSON.parse(jsonMatch[0])
      const signals: number[] = []

      for (let i = 1; i <= 9; i++) {
        let score = parseInt(parsed[`SIGNAL_${i}`])
        if (isNaN(score)) score = 0
        signals.push(Math.max(0, Math.min(10, score)))
      }

      const totalScore = signals.reduce((sum, val) => sum + val, 0)
      const displayRating = Math.round((totalScore / 90) * 10) // 10-point scale
      const verdict = this.calculateVerdict(totalScore)
      const review = parsed.REVIEW || "No review provided"

      const signalNames = [
        "Release Pipelines",
        "Cloud Architecture",
        "Infrastructure-as-Code",
        "Containerization",
        "Observability",
        "Security/DevSecOps",
        "Programming",
        "Collaboration",
        "Experience (Years)",
      ]

      const breakdown = signals
        .map((s, i) => `${signalNames[i]}: ${s}/10`)
        .join(", ")

      const detailedReview = `${displayRating}/10 - ${verdict} candidate. Breakdown: ${breakdown}. ${review}`

      return { rating: displayRating, review: detailedReview }
    } catch (e) {
      console.error("❌ Failed to parse OpenAI response:", e)
      return {
        rating: 0,
        review: "Error parsing DevOps response. Please try again.",
      }
    }
  }

  private calculateVerdict(score: number): "Strong" | "Moderate" | "Weak" {
    if (score >= 70) return "Strong"
    if (score >= 45) return "Moderate"
    return "Weak"
  }
}
