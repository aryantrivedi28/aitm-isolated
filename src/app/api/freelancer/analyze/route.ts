// import { type NextRequest, NextResponse } from "next/server"
// import { GoogleSheetsService } from "../../../../lib/services/googleSheetsService"
// import { ContentScraper } from "../../../../lib/services/content-scraper"
// import { PromptGenerator } from "../../../../lib/services/prompt-generator"
// import { OpenAIService } from "../../../../lib/services/openaiService"

// export async function POST(request: NextRequest) {
//   try {
//     const { sheet_url, sheet_name, custom_prompt, category, tech_stack, requirements } = await request.json()

//     if (!sheet_url || !sheet_name) {
//       return NextResponse.json({ error: "Missing required fields: sheet_url, sheet_name" }, { status: 400 })
//     }

//     const sheetsService = new GoogleSheetsService()
//     const contentScraper = new ContentScraper()
//     const promptGenerator = new PromptGenerator()
//     const openaiService = new OpenAIService()

//     // Read data from Google Sheet
//     const sheetData = await sheetsService.readFromSheet(sheet_url, sheet_name)
//     if (!sheetData || sheetData.length < 2) {
//       return NextResponse.json({ error: "No data found in sheet or invalid format" }, { status: 400 })
//     }

//     const headers = sheetData[0]
//     const rows = sheetData.slice(1)

//     // Find column indices
//     const getColumnIndex = (columnName: string) => {
//       const variations = [columnName, columnName.toLowerCase(), columnName.replace(" ", "_")]
//       for (const variation of variations) {
//         const index = headers.findIndex(
//           (h) => h.toLowerCase().includes(variation.toLowerCase()) || variation.toLowerCase().includes(h.toLowerCase()),
//         )
//         if (index !== -1) return index
//       }
//       return -1
//     }

//     const nameIndex = getColumnIndex("name")
//     const emailIndex = getColumnIndex("email")
//     const portfolioIndex = getColumnIndex("portfolio")
//     const githubIndex = getColumnIndex("github")
//     const resumeIndex = getColumnIndex("resume")
//     const proposalIndex = getColumnIndex("proposal")
//     const experienceIndex = getColumnIndex("experience")
//     const ratingIndex = getColumnIndex("rating")
//     const reviewIndex = getColumnIndex("review")
//     const statusIndex = getColumnIndex("status")

//     let processed = 0
//     let failed = 0
//     const results = []

//     // Process each freelancer
//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i]

//       try {
//         // Skip if already processed
//         if (statusIndex !== -1 && row[statusIndex] === "Completed") {
//           continue
//         }

//         const freelancer = {
//           name: nameIndex !== -1 ? row[nameIndex] : "",
//           email: emailIndex !== -1 ? row[emailIndex] : "",
//           years_experience: experienceIndex !== -1 ? row[experienceIndex] : "",
//           portfolio_link: portfolioIndex !== -1 ? row[portfolioIndex] : "",
//           github_link: githubIndex !== -1 ? row[githubIndex] : "",
//           resume_link: resumeIndex !== -1 ? row[resumeIndex] : "",
//           proposal_link: proposalIndex !== -1 ? row[proposalIndex] : "",
//         }

//         // Skip if no name
//         if (!freelancer.name) continue

//         console.log(`[v0] Processing freelancer: ${freelancer.name}`)

//         // Scrape content from all sources
//         const content = await contentScraper.scrapeAllContent(freelancer)

//         // Generate analysis prompt
//         const prompt = promptGenerator.generateAnalysisPrompt(
//           freelancer,
//           content,
//           category || "General",
//           tech_stack || "Various technologies",
//           custom_prompt,
//         )

//         // Get AI analysis
//         const analysis = await openaiService.analyzeFreelancer(prompt)

//         // Parse rating and review from analysis
//         const ratingMatch = analysis.match(/RATING:\s*(\d+(?:\.\d+)?)/i)
//         const reviewMatch = analysis.match(/REVIEW:\s*(.*?)(?=TECHNICAL:|RECOMMENDATION:|$)/is)

//         const rating = ratingMatch ? Number.parseFloat(ratingMatch[1]) : 0
//         const review = reviewMatch ? reviewMatch[1].trim() : analysis.substring(0, 500)

//         // Update the row with results
//         if (ratingIndex !== -1) row[ratingIndex] = rating.toString()
//         if (reviewIndex !== -1) row[reviewIndex] = review
//         if (statusIndex !== -1) row[statusIndex] = "Completed"

//         results.push({
//           name: freelancer.name,
//           rating,
//           review: review.substring(0, 200) + "...",
//         })

//         processed++
//         console.log(`[v0] Completed analysis for: ${freelancer.name} (Rating: ${rating})`)
//       } catch (error) {
//         console.error(`[v0] Error processing freelancer ${i}:`, error)
//         if (statusIndex !== -1) row[statusIndex] = "Failed"
//         failed++
//       }
//     }

//     // Write updated data back to sheet
//     const updatedData = [headers, ...rows]
//     await sheetsService.writeToSheet(sheet_url, sheet_name, updatedData)

//     return NextResponse.json({
//       success: true,
//       processed,
//       failed,
//       results,
//       message: `Analysis complete! Processed ${processed} freelancers, ${failed} failed.`,
//     })
//   } catch (error) {
//     console.error("Analysis error:", error)
//     return NextResponse.json({ error: "Failed to analyze freelancers" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
// import { GoogleSheetsService } from "../../../lib/services/google-sheets-service"
// import { OpenAIService } from "../../../lib/services/openai-service"
import { ScrapingService } from "../../../../lib/services/scrapingService"

import { GoogleSheetsService } from "../../../../lib/services/googleSheetsService"
import { OpenAIService } from "../../../../lib/services/openaiService"

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, sheetName, prompt, columnMapping } = await req.json()

    if (!sheetUrl || !prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Sheet URL and prompt are required",
        },
        { status: 400 },
      )
    }

    // Extract sheet ID from URL
    const sheetId = extractSheetId(sheetUrl)
    if (!sheetId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Google Sheet URL",
        },
        { status: 400 },
      )
    }

    const sheetService = new GoogleSheetsService(sheetId)
    await sheetService.initialize()

    // Get sheet info and detect columns
    const sheetInfo = await sheetService.getSheetInfo(sheetName)
    if (!sheetInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not access sheet",
        },
        { status: 400 },
      )
    }

    // Auto-detect column mapping if not provided
    const finalColumnMapping = columnMapping || autoDetectColumns(sheetInfo.headerRow)

    const openaiService = new OpenAIService()
    const scrapingService = new ScrapingService()

    const rows = await sheetService.getUnprocessedRows(sheetName)
    let processedCount = 0

    for (const row of rows) {
      try {
        const extractedData = await extractRowData(row, finalColumnMapping, scrapingService)

        const aiResponse = await openaiService.analyzeWithCustomPrompt(prompt, extractedData)

        await sheetService.updateRowWithRating(
          row.rowNumber,
          aiResponse.rating,
          aiResponse.review,
          finalColumnMapping.ratingColumn,
          finalColumnMapping.reviewColumn,
        )

        processedCount++
      } catch (error) {
        console.error(`Error processing row ${row.rowNumber}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      rowsAnalyzed: processedCount,
      columnMapping: finalColumnMapping,
      sheetInfo,
    })
  } catch (error) {
    console.error("Analysis failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function autoDetectColumns(headers: string[]) {
  const mapping: any = {}

  headers.forEach((header) => {
    const lower = header.toLowerCase()

    if (lower.includes("name")) mapping.nameColumn = header
    if (lower.includes("email")) mapping.emailColumn = header
    if (lower.includes("phone") || lower.includes("number")) mapping.phoneColumn = header
    if (lower.includes("resume")) mapping.resumeColumn = header
    if (lower.includes("portfolio")) mapping.portfolioColumn = header
    if (lower.includes("github")) mapping.githubColumn = header
    if (lower.includes("proposal")) mapping.proposalColumn = header
    if (lower.includes("rating")) mapping.ratingColumn = header
    if (lower.includes("review")) mapping.reviewColumn = header
    if (lower.includes("experience")) mapping.experienceColumn = header
  })

  // Set defaults if not found
  if (!mapping.ratingColumn) mapping.ratingColumn = "AI Rating"
  if (!mapping.reviewColumn) mapping.reviewColumn = "AI Review"

  return mapping
}

async function extractRowData(row: any, columnMapping: any, scrapingService: ScrapingService) {
  const data: any = {
    name: row.get(columnMapping.nameColumn) || "",
    email: row.get(columnMapping.emailColumn) || "",
    phone: row.get(columnMapping.phoneColumn) || "",
  }

  const resumeLink = row.get(columnMapping.resumeColumn)
  const portfolioLink = row.get(columnMapping.portfolioColumn)
  const proposalLink = row.get(columnMapping.proposalColumn)
  const githubLink = row.get(columnMapping.githubColumn)

  if (resumeLink) {
    data.resumeContent = await scrapingService.parseResume(resumeLink)
  }

  if (portfolioLink) {
    data.portfolioContent = await scrapingService.scrapePortfolio(portfolioLink)
  }

  if (proposalLink) {
    data.proposalContent = await scrapingService.parseResume(proposalLink)
  }

  if (githubLink) {
    data.githubContent = githubLink.includes("drive.google.com")
      ? await scrapingService.parseResume(githubLink)
      : githubLink
  }

  Object.keys(row._rawData).forEach((key) => {
    if (!Object.values(columnMapping).includes(key)) {
      data[key] = row.get(key)
    }
  })

  return data
}

function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}
