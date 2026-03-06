import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { AuditDB, supabase } from "../../../../lib/db/supabase"
import { runCompleteAudit } from "../../../../lib/audit-engine"
import { addContactToBrevo } from "../../../../lib/brevo"

/**
 * Request validation schema
 */
const auditSchema = z.object({
  email: z.string().email("Valid email required"),
  storeUrl: z.string().url("Valid store URL required"),
  name: z.string().optional(),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {

  let auditId: string | null = null

  try {

    const body = await request.json()

    const { email, storeUrl, name } = auditSchema.parse(body)

    /**
     * Create audit record
     */
    const audit = await AuditDB.createAuditRecord(
      email,
      storeUrl,
      name
    )

    auditId = audit.id

    try {

      const result = await runCompleteAudit(storeUrl)

      await AuditDB.saveAuditResults(audit.id, result)

      const criticalIssues =
        result.issues.filter(i => i.severity === "critical").length

      const highIssues =
        result.issues.filter(i => i.severity === "high").length

      const mediumIssues =
        result.issues.filter(i => i.severity === "medium").length

      const lowIssues =
        result.issues.filter(i => i.severity === "low").length

      await supabase
        .from("audits")
        .update({
          critical_issues_count: criticalIssues,
          high_issues_count: highIssues,
          medium_issues_count: mediumIssues,
          low_issues_count: lowIssues
        })
        .eq("id", audit.id)

      const topIssues = result?.issues?.slice(0, 3) || []

      const top_issue_1 = topIssues[0]?.title || ""
      const top_issue_2 = topIssues[1]?.title || ""
      const top_issue_3 = topIssues[2]?.title || ""


      const { data: updatedAudit } = await supabase
        .from("audits")
        .select("*")
        .eq("id", audit.id)
        .single()


      if (
        updatedAudit &&
        updatedAudit.status === "completed" &&
        !updatedAudit.is_email_sent
      ) {

        try {

          await addContactToBrevo({
            ...updatedAudit,
            overall_score: result.scores.overall,
            critical_issues: criticalIssues,
            top_issue_1,
            top_issue_2,
            top_issue_3
          })

          await supabase
            .from("audits")
            .update({ is_email_sent: true })
            .eq("id", audit.id)

          console.log("📩 Email automation triggered")

        } catch (brevoError) {

          console.error("❌ Brevo integration failed:", brevoError)

        }
      }

      return NextResponse.json({
        success: true,
        auditId: audit.id,
        status: "completed"
      })

    } catch (engineError: unknown) {

      const debugMessage =
        engineError instanceof Error
          ? engineError.message
          : "Unknown audit engine error"

      /**
       * Mark audit as failed
       */
      await supabase
        .from("audits")
        .update({
          status: "failed",
          error_message: debugMessage,
          completed_at: new Date().toISOString()
        })
        .eq("id", audit.id)

      console.error("❌ Audit engine failed:", debugMessage)

      return NextResponse.json(
        {
          success: false,
          code: "AUDIT_FAILED",
          userMessage:
            "We couldn’t complete the audit. The store may be private, password-protected, or blocking crawlers.",
          debugMessage:
            process.env.NODE_ENV === "development"
              ? debugMessage
              : undefined
        },
        { status: 500 }
      )
    }

  } catch (validationError) {

    const debugMessage =
      validationError instanceof Error
        ? validationError.message
        : "Invalid request payload"

    /**
     * If audit record exists mark as failed
     */
    if (auditId) {

      await supabase
        .from("audits")
        .update({
          status: "failed",
          error_message: debugMessage,
          completed_at: new Date().toISOString()
        })
        .eq("id", auditId)

    }

    return NextResponse.json(
      {
        success: false,
        code: "INVALID_REQUEST",
        userMessage:
          "Invalid input. Please check your details and try again.",
        debugMessage:
          process.env.NODE_ENV === "development"
            ? debugMessage
            : undefined
      },
      { status: 400 }
    )
  }
}