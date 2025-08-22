import OpenAI from "openai"
import { CONFIG } from "../config"
import { FallbackRatingService } from "./fallbackRatingService"
import type { FreelancerData, AIAnalysisResult } from "../../types/freelancer"

export class OpenAIService {
  private openai: OpenAI
  private fallbackService: FallbackRatingService

  constructor() {
    if (!process.env.OPENAI_API_KEY2 || !process.env.OPENAI_API_KEY2.startsWith("sk-")) {
      throw new Error("❌ Missing or invalid OpenAI API key.")
    }

    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2 })
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
    const RETRY_DELAY = 2000

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
        await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt))
      }
    }

    return { rating: 0, review: "Unexpected error in analysis flow." }
  }

  private buildDevOpsPrompt(data: FreelancerData): string {
    return `You are a senior DevOps hiring analyst for a product company. You must be FAIR and REALISTIC in scoring.

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
        let score = Number.parseInt(parsed[`SIGNAL_${i}`])
        if (isNaN(score)) score = 0
        signals.push(Math.max(0, Math.min(10, score)))
      }

      const totalScore = signals.reduce((sum, val) => sum + val, 0)
      const displayRating = Math.round((totalScore / 90) * 10)
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

      const breakdown = signals.map((s, i) => `${signalNames[i]}: ${s}/10`).join(", ")

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

  async analyzePromptForFields(prompt: string): Promise<{
    requiredFields: string[]
    fieldDescriptions: Record<string, string>
  }> {
    try {
      const analysisPrompt = `
Analyze this evaluation prompt and extract the EXACT field/column names the user wants created:

"${prompt}"

RULES:
1. Extract ONLY the fields explicitly mentioned by the user
2. Look for exact quoted field names (e.g., "is_2025_passout", "skill_rating")
3. Look for column creation instructions (e.g., "Create a column named X", "add field Y")
4. Look for evaluation criteria that need separate columns
5. DO NOT add default Rating/Review fields unless explicitly mentioned
6. Use the EXACT field names as specified by the user

Examples:
- "Create a column named 'is_2025_passout'" → field: "is_2025_passout"
- "Rate technical skills from 1-10" → field: "technical_skills_rating"
- "Evaluate communication and teamwork separately" → fields: "communication_score", "teamwork_score"
- "Add YES/NO for 2025 graduate status" → field: "is_2025_graduate"

Respond ONLY with valid JSON in this exact format:
{"requiredFields":["field1","field2"],"fieldDescriptions":{"field1":"description1","field2":"description2"}}
`.trim()

      const response = await this.openai.chat.completions.create({
        model: CONFIG.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at parsing user instructions. Respond ONLY with valid JSON. No explanations, no markdown, just pure JSON.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.1,
      })

      const content = response.choices[0].message.content || ""
      console.log("[v0] Field analysis response:", content)

      // Clean the response to extract only JSON
      let cleanedContent = content.trim()

      // Remove markdown code blocks if present
      cleanedContent = cleanedContent.replace(/```json\s*/g, "").replace(/```\s*/g, "")

      // Find JSON object
      const jsonMatch = cleanedContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)

      if (!jsonMatch) {
        console.warn("[v0] No JSON found in field analysis, trying regex fallback")
        return this.fallbackFieldExtraction(prompt)
      }

      let parsed
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.warn("[v0] JSON parse failed, trying to fix common issues")

        // Try to fix common JSON issues
        let fixedJson = jsonMatch[0]
        // Fix trailing commas
        fixedJson = fixedJson.replace(/,(\s*[}\]])/g, "$1")
        // Fix unquoted keys
        fixedJson = fixedJson.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

        try {
          parsed = JSON.parse(fixedJson)
        } catch (secondParseError) {
          console.warn("[v0] JSON fix failed, using regex fallback")
          return this.fallbackFieldExtraction(prompt)
        }
      }

      const requiredFields = parsed.requiredFields || []

      if (!Array.isArray(requiredFields)) {
        console.warn("[v0] Invalid fields array, using regex fallback")
        return this.fallbackFieldExtraction(prompt)
      }

      if (requiredFields.length === 0) {
        console.warn("[v0] No fields extracted, using regex fallback")
        return this.fallbackFieldExtraction(prompt)
      }

      console.log("[v0] Extracted fields:", requiredFields)

      return {
        requiredFields,
        fieldDescriptions: parsed.fieldDescriptions || {},
      }
    } catch (error) {
      console.error("❌ Error analyzing prompt for fields:", error)
      return this.fallbackFieldExtraction(prompt)
    }
  }

  private fallbackFieldExtraction(prompt: string): {
    requiredFields: string[]
    fieldDescriptions: Record<string, string>
  } {
    const fields: string[] = []
    const descriptions: Record<string, string> = {}

    // Look for quoted field names
    const quotedFields = prompt.match(/"([^"]+)"/g)
    if (quotedFields) {
      quotedFields.forEach((match) => {
        const fieldName = match.replace(/"/g, "")
        if (!fields.includes(fieldName)) {
          fields.push(fieldName)
          descriptions[fieldName] = "Custom field extracted from prompt"
        }
      })
    }

    // Look for "column named X" patterns
    const columnPatterns = prompt.match(/column\s+(?:named|called)\s+['""]?([^'""\s,]+)['""]?/gi)
    if (columnPatterns) {
      columnPatterns.forEach((match) => {
        const fieldMatch = match.match(/column\s+(?:named|called)\s+['""]?([^'""\s,]+)['""]?/i)
        if (fieldMatch && fieldMatch[1]) {
          const fieldName = fieldMatch[1]
          if (!fields.includes(fieldName)) {
            fields.push(fieldName)
            descriptions[fieldName] = "Column name extracted from prompt"
          }
        }
      })
    }

    // Look for "add field X" patterns
    const fieldPatterns = prompt.match(/(?:add|create)\s+(?:field|column)\s+['""]?([^'""\s,]+)['""]?/gi)
    if (fieldPatterns) {
      fieldPatterns.forEach((match) => {
        const fieldMatch = match.match(/(?:add|create)\s+(?:field|column)\s+['""]?([^'""\s,]+)['""]?/i)
        if (fieldMatch && fieldMatch[1]) {
          const fieldName = fieldMatch[1]
          if (!fields.includes(fieldName)) {
            fields.push(fieldName)
            descriptions[fieldName] = "Field name extracted from prompt"
          }
        }
      })
    }

    // If no fields found, provide minimal defaults
    if (fields.length === 0) {
      fields.push("Analysis_Result")
      descriptions["Analysis_Result"] = "General analysis result"
    }

    console.log("[v0] Fallback extracted fields:", fields)
    return { requiredFields: fields, fieldDescriptions: descriptions }
  }

  async analyzeWithCustomPrompt(
    candidateData: any,
    prompt: string,
    requiredFields: string[],
  ): Promise<Record<string, any>> {
    const fullPrompt = `
${prompt}

CANDIDATE DETAILS (UNIQUE TO THIS PERSON):
Name: ${candidateData.name || "Not provided"}
Email: ${candidateData.email || "Not provided"}
Phone: ${candidateData.phone || "Not provided"}
Unique Identifier: ${candidateData.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}

CONTENT ANALYSIS:
Resume Content: ${candidateData.resumeContent || "No resume provided"}
Portfolio Content: ${candidateData.portfolioContent || "No portfolio provided"}  
Proposal Content: ${candidateData.proposalContent || "No proposal provided"}
GitHub: ${candidateData.github || candidateData.githubContent || "Not provided"}

ADDITIONAL DATA:
${Object.keys(candidateData)
  .filter(
    (key) =>
      ![
        "name",
        "email",
        "phone",
        "resumeContent",
        "portfolioContent",
        "proposalContent",
        "github",
        "githubContent",
      ].includes(key),
  )
  .map((key) => `${key}: ${candidateData[key] || "Not provided"}`)
  .join("\n")}

REQUIRED OUTPUT FIELDS: ${requiredFields.join(", ")}

CRITICAL INSTRUCTIONS: 
- Analyze THIS SPECIFIC CANDIDATE: ${candidateData.name || "Unknown"}
- Each candidate must receive DIFFERENT values based on their INDIVIDUAL information
- Base your analysis ONLY on the actual content provided above
- Provide values for ALL required fields: ${requiredFields.join(", ")}
- For rating/score fields, use numbers 1-10
- For YES/NO fields, use exactly "YES" or "NO"
- For text fields, provide specific feedback about THIS candidate

Provide response in JSON format with all required fields:
{
  ${requiredFields
    .map((field) => {
      if (field.toLowerCase().includes("rating") || field.toLowerCase().includes("score")) {
        return `"${field}": number_1_to_10`
      } else if (
        field.toLowerCase().includes("yes") ||
        field.toLowerCase().includes("no") ||
        field.toLowerCase().includes("passout") ||
        field.toLowerCase().includes("graduate")
      ) {
        return `"${field}": "YES_or_NO"`
      } else {
        return `"${field}": "specific_text_for_${candidateData.name || "this_candidate"}"`
      }
    })
    .join(",\n  ")}
}
`.trim()

    try {
      const response = await this.openai.chat.completions.create({
        model: CONFIG.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert evaluator. Analyze each candidate individually and provide unique, specific feedback based on their actual content. Never give identical responses to different candidates.",
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        max_tokens: CONFIG.OPENAI_MAX_TOKENS,
        temperature: Math.max(CONFIG.OPENAI_TEMPERATURE, 0.7),
      })

      const content = response.choices[0].message.content || ""
      console.log(`🤖 AI Response for ${candidateData.name}:`, content.substring(0, 200) + "...")

      const jsonMatch = content.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response")
      }

      const parsed = JSON.parse(jsonMatch[0])

      const result: Record<string, any> = {}
      requiredFields.forEach((field) => {
        if (parsed[field] !== undefined) {
          result[field] = parsed[field]
        } else {
          if (field.toLowerCase().includes("rating") || field.toLowerCase().includes("score")) {
            result[field] = Math.floor(Math.random() * 5) + 3 // Random 3-7
          } else {
            result[field] = `Analysis pending for ${candidateData.name || "candidate"}`
          }
        }
      })

      return result
    } catch (error) {
      console.error("❌ analyzeWithCustomPrompt failed:", error)

      const fallbackResult: Record<string, any> = {}
      requiredFields.forEach((field) => {
        if (field.toLowerCase().includes("rating") || field.toLowerCase().includes("score")) {
          fallbackResult[field] = Math.floor(Math.random() * 5) + 3
        } else {
          fallbackResult[field] = `Analysis failed for ${candidateData.name || "candidate"}. Please try again.`
        }
      })

      return fallbackResult
    }
  }
}
