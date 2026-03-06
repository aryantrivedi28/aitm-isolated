import { NextRequest, NextResponse } from 'next/server'
import { AuditDB } from '../../../../../lib/db/supabase'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

    const audit =
      await AuditDB.getAuditById(id)

    const issuesList =
      await AuditDB.getIssuesByAuditId(id)


    /* -------------------------------
       GROUP ISSUES
    -------------------------------- */

    const issues = {

      critical: issuesList.filter(
        i => i.severity === 'critical'
      ),

      high: issuesList.filter(
        i => i.severity === 'high'
      ),

      medium: issuesList.filter(
        i => i.severity === 'medium'
      ),

      low: issuesList.filter(
        i => i.severity === 'low'
      )

    }

    /* -------------------------------
       SAFE JSON PARSER
    -------------------------------- */

    const parseJSON = (value: any) => {
      if (!value) return null
      if (typeof value === 'object') return value

      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    }

    const recommendations =
      parseJSON(audit.recommendations) || {}

    const quickWins =
      parseJSON(audit.quick_wins) || []

    const priorityActions =
      parseJSON(audit.priority_actions) || []

    const estimatedImpact =
      parseJSON(audit.estimated_impact) || {}

    const rawMetrics =
      parseJSON(audit.raw_metrics) || {}

    /* -------------------------------
       RESPONSE FOR FRONTEND
    -------------------------------- */

    return NextResponse.json({

      id: audit.id,

      store: {
        name: audit.store_name,
        url: audit.store_url,
        theme: audit.shopify_theme
      },

      status: audit.status,

      completedAt: audit.completed_at,

      scores: {
        overall: audit.overall_score,
        performance: audit.performance_score,
        seo: audit.seo_score,
        ux: audit.ux_score,
        conversion: audit.conversion_score,
        trust: audit.trust_score
      },

      issues,

      recommendations,

      quickWins,

      priorityActions,

      estimatedImpact,

      aiSummary: audit.ai_summary,

      metrics: rawMetrics

    })

  }
  catch (error) {

    console.error("❌ Audit fetch error:", error)

    return NextResponse.json(
      { error: 'Failed to fetch audit report' },
      { status: 500 }
    )

  }
}