import { NextRequest, NextResponse } from 'next/server'
import { AuditDB } from '../../../../../lib/db/supabase'



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: auditId } = await context.params

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID missing' },
        { status: 400 }
      )
    }

    const audit = await AuditDB.getAuditById(auditId)

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: audit.id,
      status: audit.status,
      scores: {
        overall: audit.overall_score,
        performance: audit.performance_score,
        seo: audit.seo_score,
        ux: audit.ux_score,
        conversion: audit.conversion_score,
        trust: audit.trust_score
      },
      issues: {
        critical: audit.critical_issues ?? [],
        high: audit.high_issues ?? [],
        medium: audit.medium_issues ?? [],
        low: audit.low_issues ?? []
      },
      recommendations: audit.recommendations ?? [],
      ai_summary: audit.ai_summary,
      isCompleted: audit.status === 'completed',
      createdAt: audit.created_at,
      completedAt: audit.completed_at
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to get audit status' },
      { status: 500 }
    )
  }
}
