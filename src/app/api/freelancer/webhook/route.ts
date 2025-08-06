import { type NextRequest, NextResponse } from "next/server"
import { ProcessingService } from "../../../../lib/services/processingService"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Webhook triggered - New form submission detected")
const body = await request.json()
   const sheetUrl = body.sheetUrl
    const processingService = new ProcessingService(sheetUrl)
    await processingService.processNewSubmissions()

    return NextResponse.json({
      success: true,
      message: "Form submission processed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Webhook processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// GET endpoint for manual trigger (optional)
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Manual processing triggered")
const body = await request.json()
   const sheetUrl = body.sheetUrl
    const processingService = new ProcessingService(sheetUrl)
    await processingService.processNewSubmissions()

    return NextResponse.json({
      success: true,
      message: "Manual processing completed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Manual processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
