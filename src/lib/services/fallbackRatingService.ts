import type { FreelancerData, AIAnalysisResult } from "../../types/freelancer"

export class FallbackRatingService {
  analyzeFreelancer(candidateData: FreelancerData): AIAnalysisResult {
    console.log("🔄 Using fallback analysis for", candidateData.name)

    // Combine all available text content
    const allContent = [
      candidateData.portfolioContent || "",
      candidateData.resumeContent || "",
      candidateData.proposalContent || "",
    ]
      .join(" ")
      .toLowerCase()

    // Score each of the 9 DevOps signals (0-10 each)
    const signals = [
      this.scoreReleasePipelines(allContent),
      this.scoreCICD(allContent),
      this.scoreCloudArchitecture(allContent),
      this.scoreInfrastructureAsCode(allContent),
      this.scoreContainerization(allContent),
      this.scoreObservability(allContent),
      this.scoreSecurity(allContent),
      this.scoreCollaboration(allContent),
      this.scoreExperience(allContent),
    ]

    // Sum all signals for total out of 90
    const totalScore = signals.reduce((sum, score) => sum + score, 0)

    // Convert to 10-point scale for display
    const displayRating = Math.round((totalScore / 90) * 100) / 10

    // Calculate verdict based on 90-point scale
    const verdict = totalScore >= 70 ? "Strong" : totalScore >= 45 ? "Moderate" : "Weak"

    const signalNames = [
      "Release Pipelines",
      "CI/CD Design",
      "Cloud Architecture",
      "Infrastructure-as-Code",
      "Containerization",
      "Observability",
      "Security/DevSecOps",
      "Ownership/Collaboration",
      "Experience Years",
    ]

    const breakdown = signals.map((score, index) => `${signalNames[index]}: ${score}/10`).join(", ")
    const shortReview = this.getShortReview(verdict)

    return {
      rating: displayRating,
      review: `${displayRating}/10 - ${verdict} candidate. Breakdown: ${breakdown}. ${shortReview}`,
    }
  }

  private scoreReleasePipelines(content: string): number {
    const keywords = ["ci/cd", "jenkins", "gitlab", "github actions", "pipeline", "deployment", "release"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    // More generous scoring for technical people
    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 3, 10) // Give base 3 points for developers
    }
    return Math.min(matches * 2, 10)
  }

  private scoreCICD(content: string): number {
    const keywords = ["ci/cd", "continuous integration", "continuous deployment", "build automation", "jenkins"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 3, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreCloudArchitecture(content: string): number {
    const keywords = ["aws", "azure", "gcp", "google cloud", "cloud", "ec2", "s3", "lambda", "server", "hosting"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 2, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreInfrastructureAsCode(content: string): number {
    const keywords = ["terraform", "cloudformation", "ansible", "pulumi", "infrastructure", "automation", "scripting"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 2, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreContainerization(content: string): number {
    const keywords = ["docker", "kubernetes", "k8s", "container", "helm", "microservices"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 2, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreObservability(content: string): number {
    const keywords = ["monitoring", "logging", "prometheus", "grafana", "elk", "datadog", "metrics", "debugging"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 2, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreSecurity(content: string): number {
    const keywords = ["security", "devsecops", "vulnerability", "compliance", "sast", "dast", "https", "ssl"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 2, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreCollaboration(content: string): number {
    const keywords = ["team", "collaboration", "leadership", "mentoring", "agile", "scrum", "project"]
    const matches = keywords.filter((keyword) => content.includes(keyword)).length

    if (content.includes("developer") || content.includes("programming")) {
      return Math.min(matches * 2 + 3, 10)
    }
    return Math.min(matches * 2, 10)
  }

  private scoreExperience(content: string): number {
    // Look for years of experience indicators
    const yearMatches = content.match(/(\d+)\s*years?/g) || []
    const maxYears = yearMatches.reduce((max, match) => {
      const years = Number.parseInt(match.match(/\d+/)?.[0] || "0")
      return Math.max(max, years)
    }, 0)

    if (maxYears >= 5) return 8
    if (maxYears >= 3) return 6
    if (maxYears >= 1) return 4

    // Check for general experience indicators
    const expKeywords = ["experience", "worked", "developed", "built", "managed", "developer", "engineer"]
    const matches = expKeywords.filter((keyword) => content.includes(keyword)).length
    return Math.min(matches + 2, 6) // More generous base scoring
  }

  private getShortReview(verdict: string): string {
    if (verdict === "Strong") {
      return "Strong technical background with relevant DevOps skills."
    } else if (verdict === "Moderate") {
      return "Good technical foundation, needs more DevOps experience."
    } else {
      return "Limited DevOps experience, focus on gaining hands-on skills."
    }
  }
}
