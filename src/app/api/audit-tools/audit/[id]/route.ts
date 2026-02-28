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


    const issues = {

      critical:
        issuesList.filter(
          i => i.severity === 'critical'
        ),

      high:
        issuesList.filter(
          i => i.severity === 'high'
        ),

      medium:
        issuesList.filter(
          i => i.severity === 'medium'
        ),

      low:
        issuesList.filter(
          i => i.severity === 'low'
        )
    }


    return NextResponse.json({

      ...audit,

      scores: {
        overall: audit.overall_score,
        performance:
          audit.performance_score,
        seo:
          audit.seo_score,
        ux:
          audit.ux_score,
        conversion:
          audit.conversion_score,
        trust:
          audit.trust_score
      },

      issues

    })

  }
  catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    )
  }

}