import { NextRequest, NextResponse } from "next/server"
import { extractSheetId } from "../../../../lib/utils/google"
import { GoogleSheetsService } from "../../../../lib/services/googleSheetsService"
import { OpenAIService } from "../../../../lib/services/openaiService"
import { ScrapingService } from "../../../../lib/services/scrapingService" // ✅ Add this

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
    const scrapingService = new ScrapingService()

    const rows = await sheetService.getUnprocessedRows()

for (let i = 0; i < rows.length; i++) {
  const row = rows[i]

  const data = {
    name: row.get("Name") || "",
    email: row.get("Email") || "",
    number: row.get("Number") || "",
    resumeLink: row.get("Resume") || "",
    portfolioLink: row.get("Portfolio Link") || "",
    proposalLink: row.get("Proposal") || "",
    githubLink: row.get("Github Link") || "",
  }

  const scrapingService = new ScrapingService()

  const resumeText = data.resumeLink ? await scrapingService.parseResume(data.resumeLink) : ""
  const portfolioText = data.portfolioLink ? await scrapingService.parsePortfolio(data.portfolioLink) : ""
  const proposalText = data.proposalLink ? await scrapingService.parseResume(data.proposalLink) : ""
  const githubText = data.githubLink?.includes("drive.google.com")
    ? await scrapingService.parseResume(data.githubLink)
    : data.githubLink || ""

  const finalData = {
    name: data.name,
    email: data.email,
    number: data.number,
    resumeContent: resumeText,
    portfolioContent: portfolioText,
    proposalContent: proposalText,
    githubContent: githubText,
  }

  const aiResponse = await openaiService.analyzeWithCustomPrompt(prompt, finalData)
  await sheetService.updateRowWithRating(row.rowNumber, aiResponse.rating, aiResponse.review)
}


    return NextResponse.json({ success: true, message: `Processed ${rows.length} rows.` })

  } catch (err) {
    const error = err as Error
    console.error("❌ Analysis failed:", err)
    return NextResponse.json({ success: false, error: "Server error", details: error.message }, { status: 500 })
  }
}
