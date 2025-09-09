import { type NextRequest, NextResponse } from "next/server"
import { createDocuSealClient } from "../../../../lib/agreements/docuseal-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get("submissionId")

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 })
    }

    const docuseal = createDocuSealClient()
    const submission = await docuseal.getSubmission(submissionId)

    return NextResponse.json({
      status: submission.status,
      submitters: submission.submitters,
      completedAt: submission.completed_at,
      auditTrailUrl: submission.audit_trail_url,
      documents: submission.documents,
    })
  } catch (error) {
    console.error("Error getting DocuSeal status:", error)
    return NextResponse.json({ error: "Failed to get signature status" }, { status: 500 })
  }
}
