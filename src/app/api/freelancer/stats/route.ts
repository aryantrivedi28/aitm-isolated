import { type NextRequest, NextResponse } from "next/server"
import { ProcessingService } from "../../../../lib/services/processingService"

export async function GET(request: NextRequest) {
  try {
    const processingService = new ProcessingService()
    const stats = await processingService.getStatus()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Stats error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
