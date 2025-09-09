import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export class AIGenerator {
  static async generateClientAgreementTerms(
    projectTitle: string,
    scope: string,
    paymentAmount: number,
    currency: string,
  ): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"), // Using gpt-4o-mini instead of gpt-4 for better availability and cost
        prompt: `Generate professional terms and conditions for a client service agreement with the following details:
        
Project: ${projectTitle}
Scope: ${scope}
Payment: ${currency} ${paymentAmount}

Include standard clauses for:
- Payment terms and late fees
- Intellectual property rights
- Confidentiality
- Termination conditions
- Liability limitations
- Dispute resolution

IMPORTANT: Do not use Markdown (##, **, ---, etc.).
Format the agreement in plain text only with numbered sections and clear titles.
Make it professional but client-friendly. Keep it concise but comprehensive.`,
      })

      return text
    } catch (error) {
      console.error("Error generating client agreement terms:", error)
      throw new Error("Failed to generate terms. Please check your OpenAI API key.")
    }
  }

  static async generateFreelancerAgreementTerms(
    workType: string,
    hourlyRate: number,
    projectDuration: string,
  ): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"), // Using gpt-4o-mini instead of gpt-4 for better availability and cost
        prompt: `Generate professional terms and conditions for a freelancer agreement with the following details:
        
Work Type: ${workType}
Hourly Rate: $${hourlyRate}
Duration: ${projectDuration}

Include standard clauses for:
- Work scope and deliverables
- Payment terms and schedule
- Intellectual property ownership
- Non-disclosure agreement
- Independent contractor status
- Termination conditions
- Quality standards
IMPORTANT: Do not use Markdown (##, **, ---, etc.).
Format the agreement in plain text only with numbered sections and clear titles.
Make it fair for both parties and legally sound.`,
      })

      return text
    } catch (error) {
      console.error("Error generating freelancer agreement terms:", error)
      throw new Error("Failed to generate terms. Please check your OpenAI API key.")
    }
  }

  static async generatePaymentTerms(amount: number, currency: string, projectType: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"), // Using gpt-4o-mini instead of gpt-4 for better availability and cost
        prompt: `Generate professional payment terms for a ${projectType} project worth ${currency} ${amount}.

Include:
- Payment schedule (milestone-based or time-based)
- Late payment penalties
- Accepted payment methods
- Invoice terms
- Refund policy (if applicable)
IMPORTANT: Do not use Markdown (##, **, ---, etc.).
Format the agreement in plain text only with numbered sections and clear titles.
Keep it professional and industry-standard.`,
      })

      return text
    } catch (error) {
      console.error("Error generating payment terms:", error)
      throw new Error("Failed to generate terms. Please check your OpenAI API key.")
    }
  }

  static async generateCustomTerms(prompt: string, context?: any): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    try {
      let enhancedPrompt = `Generate professional content based on this request: ${prompt}

⚠️ IMPORTANT: Do not use Markdown (##, **, ---, etc.).
Format everything as plain text only with numbered sections and clear titles.
`

      if (context) {
        enhancedPrompt += `\n\nContext:
        - Project: ${context.projectTitle || "N/A"}
        - Client: ${context.clientName || "N/A"}
        - Freelancer: ${context.freelancerName || "N/A"}
        - Work Type: ${context.workType || "N/A"}
        - Payment: ${context.currency || "USD"} ${context.paymentAmount || "N/A"}`
      }

      enhancedPrompt += `\n\nMake it professional, comprehensive, and business-appropriate. Format it clearly and ensure it's legally sound.`

      const { text } = await generateText({
        model: openai("gpt-4o-mini"), // Using gpt-4o-mini instead of gpt-4 for better availability and cost
        prompt: enhancedPrompt,
      })

      return text
    } catch (error) {
      console.error("Error generating custom terms:", error)
      throw new Error("Failed to generate terms. Please check your OpenAI API key.")
    }
  }
}
