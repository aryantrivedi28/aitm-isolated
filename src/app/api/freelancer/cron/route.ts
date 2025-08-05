import { type NextRequest, NextResponse } from "next/server"
// If your file is at src/lib/services/processingService.ts, use the following relative import:
import { ProcessingService } from "../../../../lib/services/processingService"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    const CRON_SECRET = "asdfwertiowieonfosieowief"

    if (authHeader !== `Bearer ${CRON_SECRET}` && token !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("⏰ Scheduled processing started")

    const processingService = new ProcessingService()
    await processingService.processNewSubmissions()

    return NextResponse.json({
      success: true,
      message: "Scheduled processing completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Scheduled processing error:", error)
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

