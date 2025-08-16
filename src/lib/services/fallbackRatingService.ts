import type { FreelancerData, AIAnalysisResult } from "../../types/freelancer"

export class FallbackRatingService {
  analyzeFreelancer(candidateData: FreelancerData): AIAnalysisResult {
    console.log("🔄 Using fallback rating service...")

    let score = 0
    const factors: string[] = []

    // Basic scoring based on available data
    if (candidateData.name && candidateData.name.length > 2) {
      score += 1
      factors.push("Name provided")
    }

    if (candidateData.email && candidateData.email.includes("@")) {
      score += 1
      factors.push("Valid email")
    }

    if (candidateData.resumeContent && candidateData.resumeContent.length > 100) {
      score += 3
      factors.push("Resume content available")
    }

    if (candidateData.portfolioContent && candidateData.portfolioContent.length > 50) {
      score += 2
      factors.push("Portfolio content available")
    }

    if (candidateData.proposalContent && candidateData.proposalContent.length > 50) {
      score += 2
      factors.push("Proposal content available")
    }

    if (candidateData.github && candidateData.github.length > 10) {
      score += 1
      factors.push("GitHub profile provided")
    }

    // Convert to 1-10 scale
    const rating = Math.min(10, Math.max(1, score))

    const review = `Fallback analysis: ${rating}/10. Factors: ${factors.join(", ") || "Limited data available"}.`

    return {
      rating,
      review,
    }
  }
}
