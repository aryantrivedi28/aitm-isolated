import { type NextRequest, NextResponse } from "next/server"
import { GoogleSheetsService } from "../../../lib/services/googleSheetsService"
import { OpenAIService } from "../../../lib/services/openaiService"
import { ScrapingService } from "../../../lib/services/scrapingService"

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
