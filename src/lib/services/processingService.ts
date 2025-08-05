import { GoogleSheetsService } from "./googleSheetsService"
import { ScrapingService } from "./scrapingService"
import { OpenAIService } from "./openaiService"
import type { FreelancerData } from "../../types/freelancer"

export interface ProcessingResult {
  success: boolean
  data?: {
    resume: string
    portfolio: string
    proposal: string
  }
  error?: string
}

export class ProcessingService {
  private sheetsService: GoogleSheetsService
  private scrapingService: ScrapingService
  private openaiService: OpenAIService

  private status = {
    isRunning: false,
    processedCount: 0,
    totalCount: 0,
    errors: [] as string[],
  }

  constructor() {
    this.sheetsService = new GoogleSheetsService()
    this.scrapingService = new ScrapingService()
    this.openaiService = new OpenAIService()
  }

  getStatus() {
    return this.status
  }

  async initialize(): Promise<void> {
    console.log("🔄 Initializing services...")

    const sheetsInit = await this.sheetsService.initialize()
    const scrapingInit = await this.scrapingService.initialize()

    if (!sheetsInit) {
      throw new Error("Failed to initialize Google Sheets service")
    }
    if (!scrapingInit) {
      throw new Error("Failed to initialize scraping service")
    }

    console.log("✅ Services initialized successfully")
  }

  async processNewSubmissions(): Promise<void> {
    if (this.status.isRunning) {
      console.log("⚠️ Processing already in progress")
      return
    }

    this.status.isRunning = true
    this.status.processedCount = 0
    this.status.totalCount = 0
    this.status.errors = []

    console.log("🚀 Starting automatic processing of new submissions...")
    console.log("⏰ Time:", new Date().toISOString())

    try {
      await this.initialize()

      // Get sheet info for debugging
      const sheetInfo = await this.sheetsService.getSheetInfo()
      console.log("📋 Sheet info:", JSON.stringify(sheetInfo, null, 2))

      console.log(`\n📂 Processing main sheet...`)
      await this.processMainSheet()

      console.log("\n✅ Automatic processing completed successfully!")
    } catch (error) {
      console.error("❌ Processing failed:", error)
      this.status.errors.push(error instanceof Error ? error.message : "Unknown error")
      throw error
    } finally {
      this.status.isRunning = false
      await this.cleanup()
    }
  }

  private async processMainSheet(): Promise<void> {
    try {
      const unprocessedRows = await this.sheetsService.getUnprocessedRows()

      if (unprocessedRows.length === 0) {
        console.log(`ℹ️  No new submissions found`)
        return
      }

      this.status.totalCount = unprocessedRows.length
      console.log(`📝 Processing ${unprocessedRows.length} new submissions`)

      for (let i = 0; i < unprocessedRows.length; i++) {
        const row = unprocessedRows[i]
        console.log(`\n[${i + 1}/${unprocessedRows.length}] Processing submission...`)

        try {
          await this.processIndividualRow(row)
          this.status.processedCount++
        } catch (error) {
          const errorMsg = `Failed to process row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
          console.error(errorMsg)
          this.status.errors.push(errorMsg)
        }

        // Add delay to avoid rate limiting
        await this.delay(2000)
      }
    } catch (error) {
      console.error(`❌ Error processing main sheet:`, error)
      throw error
    }
  }

  private async processIndividualRow(row: any): Promise<void> {
    try {
      console.log("🔍 Row debug info:")
      console.log(`  Row Number: ${row.rowNumber}`)

      // Extract candidate data using the proper row.get() method
      const candidateData: FreelancerData = {
        timestamp: this.safeGetRowValue(row, "Timestamp") || new Date().toISOString(),
        name: this.safeGetRowValue(row, "Name") || "Unknown",
        email: this.safeGetRowValue(row, "Email") || "No email",
        portfolioUrl: this.safeGetRowValue(row, "Portfolio Link") || "",
        resumeFile: this.safeGetRowValue(row, "Resume") || "",
        proposalText: this.safeGetRowValue(row, "Proposal") || "",
        github: this.safeGetRowValue(row, "Github Link") || "",
      }

      console.log(`👤 Processing: ${candidateData.name} (${candidateData.email})`)
      console.log(`📅 Submitted: ${candidateData.timestamp}`)
      console.log(`📝 Proposal Text Length: ${candidateData.proposalText?.length || 0}`)
      console.log(`🔗 Portfolio URL: ${candidateData.portfolioUrl}`)
      console.log(`📄 Resume File: ${candidateData.resumeFile}`)

      // Check if we have meaningful content - including checking for proposal files
      const hasProposalText = candidateData.proposalText && candidateData.proposalText.length > 10
      const hasProposalFile = this.isFileUrl(candidateData.proposalText)
      const hasResume = candidateData.resumeFile && candidateData.resumeFile.includes("drive.google.com")
      const hasPortfolio = candidateData.portfolioUrl && candidateData.portfolioUrl.length > 10

      console.log(`📊 Content availability:`)
      console.log(`  Proposal Text: ${hasProposalText}`)
      console.log(`  Proposal File: ${hasProposalFile}`)
      console.log(`  Resume: ${hasResume}`)
      console.log(`  Portfolio: ${hasPortfolio}`)

      // If no meaningful content, provide a helpful message
      if (!hasProposalText && !hasProposalFile && !hasResume && !hasPortfolio) {
        console.log("⚠️ No meaningful content found - skipping AI analysis")
        const errorMessage =
          "❌ INSUFFICIENT DATA: Missing proposal text/file, resume file, and portfolio. Please provide at least one of these for evaluation. Contact support if you need help."

        const success = await this.sheetsService.updateRowWithRating(row.rowNumber - 1, 0, errorMessage)

        if (success) {
          console.log(`✅ Updated ${candidateData.name} with data requirement message`)
        }
        return
      }

      // Step 1: Parse resume if available
      let resumeContent = "No resume provided"
      let resumeAccessible = false
      if (hasResume && candidateData.resumeFile) {
        console.log("📄 Parsing resume file...")
        resumeContent = await this.scrapingService.parseResume(candidateData.resumeFile)
        resumeAccessible = !resumeContent.includes("Resume parsing failed")
        console.log(`📄 Resume parsed: ${resumeContent.length} characters (accessible: ${resumeAccessible})`)
      }

      // Step 2: Scrape portfolio if available
      let portfolioContent = "No portfolio provided"
      if (hasPortfolio && candidateData.portfolioUrl) {
        console.log("🌐 Scraping portfolio...")
        portfolioContent = await this.scrapingService.scrapePortfolio(candidateData.portfolioUrl)
        console.log(`🌐 Portfolio scraped: ${portfolioContent.length} characters`)
      }

      // Step 3: Process proposal (text or file)
      let proposalContent = "No proposal provided"
      let proposalAccessible = false
      if (hasProposalFile && candidateData.proposalText) {
        console.log("📝 Parsing proposal file...")
        proposalContent = await this.scrapingService.parseResume(candidateData.proposalText) // Use same parsing logic
        proposalAccessible = !proposalContent.includes("Resume parsing failed")
        console.log(`📝 Proposal file parsed: ${proposalContent.length} characters (accessible: ${proposalAccessible})`)
      } else if (hasProposalText && candidateData.proposalText) {
        console.log("📝 Processing proposal text...")
        proposalContent = await this.scrapingService.readProposal(candidateData.proposalText)
        proposalAccessible = true
        console.log(`📝 Proposal text processed: ${proposalContent.length} characters`)
      }

      // Check if we have any accessible content
      const hasAccessibleContent =
        resumeAccessible ||
        proposalAccessible ||
        (portfolioContent && portfolioContent.length > 50 && !portfolioContent.includes("No portfolio"))

      if (!hasAccessibleContent) {
        console.log("❌ No accessible content found - all files may be private")

        const fileAccessMessage = this.generateFileAccessMessage(candidateData)

        const success = await this.sheetsService.updateRowWithRating(row.rowNumber, 0, fileAccessMessage)

        if (success) {
          console.log(`✅ Updated ${candidateData.name} with file access guidance`)
        }
        return
      }

      // Build comprehensive content for AI analysis
      candidateData.resumeContent = resumeContent
      candidateData.portfolioContent = portfolioContent
      candidateData.proposalContent = proposalContent

      console.log(`📊 Content summary:`)
      console.log(`  Resume: ${resumeContent.length} chars (accessible: ${resumeAccessible})`)
      console.log(`  Portfolio: ${portfolioContent.length} chars`)
      console.log(`  Proposal: ${proposalContent.length} chars (accessible: ${proposalAccessible})`)

      // Step 4: Get AI analysis
      console.log("🤖 Sending to OpenAI for analysis...")
      const aiResults = await this.openaiService.analyzeFreelancer(candidateData)

      // Add content accessibility info to the review
      // const accessibilityNote = this.generateAccessibilityNote(resumeAccessible, proposalAccessible)
      const finalReview = `${aiResults.review}`

      // Step 5: Update sheet with results
      console.log("💾 Updating sheet with rating...")
      const success = await this.sheetsService.updateRowWithRating(row.rowNumber - 1, aiResults.rating, finalReview)

      if (success) {
        console.log(`✅ Successfully processed ${candidateData.name} - Rating: ${aiResults.rating}/10`)
      } else {
        console.log(`❌ Failed to update sheet for ${candidateData.name}`)
        throw new Error("Failed to update sheet")
      }
    } catch (error) {
      console.error(`❌ Error processing individual row:`, error)
      throw error
    }
  }

  private generateFileAccessMessage(candidateData: FreelancerData): string {
    const issues = []

    if (candidateData.resumeFile && candidateData.resumeFile.includes("drive.google.com")) {
      issues.push("📄 Resume file is not publicly accessible")
    }

    if (this.isFileUrl(candidateData.proposalText)) {
      issues.push("📝 Proposal file is not publicly accessible")
    }

    const message = `❌ FILE ACCESS ISSUES DETECTED:

${issues.join("\n")}

🔧 TO FIX THIS:
1. Open each Google Drive file
2. Click the "Share" button
3. Change access to "Anyone with the link can view"
4. Copy the new shareable link
5. Resubmit the form with the updated links

📧 Need help? Contact support with your submission details.

⚠️ Current evaluation based on limited accessible content only.`

    return message
  }

  // private generateAccessibilityNote(resumeAccessible: boolean, proposalAccessible: boolean): string {
  //   const issues = []

  //   if (!resumeAccessible) {
  //     issues.push("Resume file not accessible")
  //   }

  //   if (!proposalAccessible) {
  //     issues.push("Proposal file not accessible")
  //   }

  //   if (issues.length > 0) {
  //     return `\n\n⚠️ NOTE: ${issues.join(", ")} - evaluation based on available content only. Please make files publicly accessible for complete analysis.`
  //   }

  //   return ""
  // }

  // Helper method to check if a string is a file URL
  private isFileUrl(text: string | undefined): boolean {
    if (!text) return false
    return (
      text.includes("drive.google.com") ||
      text.includes("docs.google.com") ||
      text.includes("dropbox.com") ||
      text.includes("onedrive.com") ||
      (text.startsWith("http") &&
        (text.includes(".pdf") || text.includes(".doc") || text.includes(".docx") || text.includes(".txt")))
    )
  }

  // Helper method to safely get row values
  private safeGetRowValue(row: any, columnName: string): string {
    try {
      const value = row.get(columnName)
      return value ? value.toString().trim() : ""
    } catch (error) {
      console.warn(`Could not get value for column "${columnName}":`, error)
      return ""
    }
  }

  private async cleanup(): Promise<void> {
    await this.scrapingService.close()
    console.log("🧹 Cleanup completed")
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async processFreelancerData(data: {
    resumeUrl?: string
    portfolioUrl?: string
    proposalText?: string
  }): Promise<ProcessingResult> {
    try {
      // Simple text processing for OpenAI test
      const resume = data.resumeUrl || "No resume provided"
      const portfolio = data.portfolioUrl || "No portfolio provided"
      const proposal = data.proposalText || "No proposal provided"

      return {
        success: true,
        data: {
          resume,
          portfolio,
          proposal,
        },
      }
    } catch (error) {
      console.error("Processing failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown processing error",
      }
    }
  }

  async getCategoryStats() {
    try {
      // This would typically fetch data from your database or Google Sheets
      // For now, return mock data that matches the expected structure
      return {
        totalCandidates: 0,
        strongCandidates: 0,
        averageScore: 0,
        pendingEvaluations: 0,
        categoryBreakdown: {
          releasePipelines: 0,
          cloudArchitecture: 0,
          infrastructureAsCode: 0,
          containerization: 0,
          observability: 0,
          security: 0,
          experience: 0,
          collaboration: 0,
        },
        recentEvaluations: [],
      }
    } catch (error) {
      console.error("Error getting category stats:", error)
      return {
        totalCandidates: 0,
        strongCandidates: 0,
        averageScore: 0,
        pendingEvaluations: 0,
        categoryBreakdown: {
          releasePipelines: 0,
          cloudArchitecture: 0,
          infrastructureAsCode: 0,
          containerization: 0,
          observability: 0,
          security: 0,
          experience: 0,
          collaboration: 0,
        },
        recentEvaluations: [],
      }
    }
  }

  // Add this method to get processing statistics
  getProcessingStats() {
    return {
      isRunning: this.status.isRunning,
      processedCount: this.status.processedCount,
      totalCount: this.status.totalCount,
      errors: this.status.errors,
      successRate: this.status.totalCount > 0 ? (this.status.processedCount / this.status.totalCount) * 100 : 0,
    }
  }

  // Add this method to get recent evaluations
  async getRecentEvaluations(limit = 10) {
    try {
      // This would typically fetch from your database
      // For now, return empty array
      return []
    } catch (error) {
      console.error("Error getting recent evaluations:", error)
      return []
    }
  }

  async close(): Promise<void> {
    await this.scrapingService.close()
    console.log("🧹 Cleanup completed")
  }
}
