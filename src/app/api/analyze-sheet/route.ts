import { type NextRequest, NextResponse } from "next/server"
import { GoogleSheetsService } from "../../../lib/services/googleSheetsService"
import { OpenAIService } from "../../../lib/services/openaiService"
import { ScrapingService } from "../../../lib/services/scrapingService"

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, sheetName, prompt } = await req.json()

    if (!sheetUrl || !prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Sheet URL and prompt are required",
        },
        { status: 400 },
      )
    }

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

    const sheetInfo = await sheetService.getSheetInfo(sheetName)
    if (!sheetInfo) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not access sheet${sheetName ? ` "${sheetName}"` : ""}`,
        },
        { status: 400 },
      )
    }

    const openaiService = new OpenAIService()

    const fieldAnalysis = await openaiService.analyzePromptForFields(prompt)

    const columnsCreated = await sheetService.ensureColumnsExist(
      fieldAnalysis.requiredFields,
      fieldAnalysis.fieldDescriptions,
      sheetName,
    )

    if (!columnsCreated) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create required columns in sheet",
        },
        { status: 500 },
      )
    }

    const columnMapping = autoDetectColumns(sheetInfo.headerRow)

    const scrapingService = new ScrapingService()
    const rows = await sheetService.getUnprocessedRows(fieldAnalysis.requiredFields, sheetName)
    let processedCount = 0

    for (const row of rows) {
      try {
        const extractedData = await extractRowData(row, columnMapping, scrapingService)


        const analysisResults = await openaiService.analyzeWithCustomPrompt(
          extractedData,
          prompt,
          fieldAnalysis.requiredFields,
        )

        const success = await sheetService.updateRowWithMultipleFields(
          row.rowNumber,
          analysisResults,
          extractedData.name,
          sheetName,
        )

        if (success) {
          processedCount++
        }
      } catch (error) {
        console.error(`❌ Error processing row ${row.rowNumber}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      rowsAnalyzed: processedCount,
      fieldsCreated: fieldAnalysis.requiredFields,
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
    if (lower.includes("experience")) mapping.experienceColumn = header
  })


  return mapping
}

async function extractRowData(row: any, columnMapping: any, scrapingService: ScrapingService) {
  const data: any = {
    name: row.get(columnMapping.nameColumn) || "",
    email: row.get(columnMapping.emailColumn) || "",
    phone: row.get(columnMapping.phoneColumn) || "",
  }

  Object.keys(row._rawData).forEach((key) => {
    if (!Object.values(columnMapping).includes(key)) {
      data[key] = row.get(key)
    }
  })

  const resumeLink = row.get(columnMapping.resumeColumn)
  const portfolioLink = row.get(columnMapping.portfolioColumn)
  const proposalLink = row.get(columnMapping.proposalColumn)
  const githubLink = row.get(columnMapping.githubColumn)

  try {
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
  } catch (error) {
    console.error(`⚠️ Content extraction error for ${data.name}:`, error)
  }

  return data
}

function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}
