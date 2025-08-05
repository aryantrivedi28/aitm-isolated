import { type NextRequest, NextResponse } from "next/server"
import { GoogleSheetsService } from "../../../../lib/services/googleSheetsService"

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService()
    await sheetsService.initialize()

    const sheetInfo = await sheetsService.getSheetInfo()
    const unprocessedRows = await sheetsService.getUnprocessedRows()

    return NextResponse.json({
      success: true,
      data: {
        sheetInfo,
        unprocessedRowsCount: unprocessedRows.length,
        message: "Debug info for your Google Sheet setup",
        expectedColumns: [
          "A: Timestamp",
          "B: Name",
          "C: Email",
          "D: Portfolio Link",
          "E: GitHub Link",
          "F: Resume File",
          "G: Proposal",
          "H: Rating (AI fills this)",
        ],
      },
    })
  } catch (error) {
    console.error("Debug error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
