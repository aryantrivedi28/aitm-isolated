import { NextRequest, NextResponse } from "next/server"
import { extractSheetId } from "../../../../lib/utils/google"
import { GoogleSheetsService } from "../../../../lib/services/googleSheetsService"
import { OpenAIService } from "../../../../lib/services/openaiService"

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, prompt } = await req.json()

    if (!sheetUrl || !prompt) {
      return NextResponse.json({ success: false, error: "Sheet URL and prompt are required" }, { status: 400 })
    }

    const sheetId = extractSheetId(sheetUrl)
    if (!sheetId) {
      return NextResponse.json({ success: false, error: "Invalid Google Sheet URL" }, { status: 400 })
    }

    const sheetService = new GoogleSheetsService(sheetId)
    await sheetService.initialize()

    const openaiService = new OpenAIService()

    const rows = await sheetService.getUnprocessedRows()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      const data = {
        name: row.get("Name") || "",
        resumeContent: row.get("Resume") || "",
        portfolioContent: row.get("Portfolio Link") || "",
        proposalContent: row.get("Proposal") || "",
        github: row.get("Github Link") || "",
      }

      const aiResponse = await openaiService.analyzeWithCustomPrompt(prompt, data)
      await sheetService.updateRowWithRating(row.rowNumber, aiResponse.rating, aiResponse.review)
    }

    return NextResponse.json({ success: true, message: `Processed ${rows.length} rows.` })
  } catch (err) {
      const error = err as Error
    console.error("❌ Analysis failed:", err)
    return NextResponse.json({ success: false, error: "Server error", details: error.message }, { status: 500 })
  }
}
