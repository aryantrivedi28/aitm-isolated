import { type NextRequest, NextResponse } from "next/server"
// ✅ Adjust import path based on actual location
import { ProcessingService } from "../../../../lib/services/processingService"

export async function GET(request: NextRequest) {
  try {
    // ✅ Token check (from header or query param)
    const authHeader = request.headers.get("authorization")
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    const CRON_SECRET = "asdfwertiowieonfosieowief" // You can move this to a config file or env variable

    if (authHeader !== `Bearer ${CRON_SECRET}` && token !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("⏰ Scheduled processing started")

    // ✅ Instantiate the processing service
    const body = await request.json()
   const sheetUrl = body.sheetUrl// or get from config/env/query
const processingService = new ProcessingService(sheetUrl)


    // ✅ Run the processing
    await processingService.processNewSubmissions()

    return NextResponse.json({
      success: true,
      message: "Scheduled processing completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // ✅ Correctly narrow down the error type
    const errMsg = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("❌ Scheduled processing error:", errMsg)

    return NextResponse.json(
      {
        success: false,
        error: errMsg,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
