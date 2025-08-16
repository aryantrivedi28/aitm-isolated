import { type NextRequest, NextResponse } from "next/server"
import { GoogleSheetsService } from "../../../lib/services/googleSheetsService"

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, sheetName } = await req.json()

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
          error: "Could not access sheet",
        },
        { status: 400 },
      )
    }

    // Auto-detect column mapping
    const columnMapping = autoDetectColumns(sheetInfo.headerRow)

    return NextResponse.json({
      success: true,
      sheetInfo,
      columnMapping,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to preview sheet",
      },
      { status: 500 },
    )
  }
}

function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
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

  if (!mapping.ratingColumn) mapping.ratingColumn = "AI Rating"
  if (!mapping.reviewColumn) mapping.reviewColumn = "AI Review"

  return mapping
}
