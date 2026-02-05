import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuditDB } from '../../../../lib/db/supabase'
import { runCompleteAudit } from '../../../../lib/audit-engine'
import { supabase } from '../../../../lib/db/supabase'

const auditSchema = z.object({
  email: z.string().email('Valid email required'),
  storeUrl: z.string().url('Valid URL required'),
  name: z.string().optional(),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {
  console.log('🔵 [AUDIT API] POST /api/audit-tools/audit called')

  try {
    console.log('🟡 Parsing request body...')
    const body = await request.json()
    console.log('🟢 Request body:', body)

    console.log('🟡 Validating request body with Zod...')
    const { email, storeUrl, name, phone } = auditSchema.parse(body)
    console.log('🟢 Validation passed:', { email, storeUrl, name, phone })

    console.log('🟡 Creating audit DB record...')
    const audit = await AuditDB.createAuditRecord(email, storeUrl, name)
    console.log('🟢 Audit record created:', audit)

    // Respond immediately
    const response = NextResponse.json({
      success: true,
      auditId: audit.id,
      message: 'Audit started. Results will be ready in 1-2 minutes.'
    })

    // Background execution
    setTimeout(async () => {
      console.log('🔵 [AUDIT BG] Background task started')
      console.log('🔵 [AUDIT BG] Store URL:', storeUrl)
      console.log('🔵 [AUDIT BG] Audit ID:', audit.id)

      try {
        console.log('🟡 [AUDIT BG] Running complete audit...')
        const auditResult = await runCompleteAudit(storeUrl)
        console.log('🟢 [AUDIT BG] Audit completed successfully')

        console.log('🟡 [AUDIT BG] Saving audit results...')
        await AuditDB.saveAuditResults(audit.id, auditResult)
        console.log('🟢 [AUDIT BG] Results saved to database')

      } catch (error) {
        console.error('🔴 [AUDIT BG] Audit failed')
        console.error('🔴 [AUDIT BG] Error object:', error)

        if (error instanceof Error) {
          console.error('🔴 [AUDIT BG] Message:', error.message)
          console.error('🔴 [AUDIT BG] Stack:', error.stack)
        }

        console.log('🟡 [AUDIT BG] Updating audit status to FAILED')

        await supabase
          .from('audits')
          .update({
            status: 'failed',
            error_message:
              error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', audit.id)

        console.log('🟢 [AUDIT BG] Audit marked as failed in DB')
      }
    }, 0)

    console.log('🟢 [AUDIT API] Response returned to client')
    return response

  } catch (error) {
    console.error('🔴 [AUDIT API] Request failed')
    console.error('🔴 [AUDIT API] Error object:', error)

    if (error instanceof z.ZodError) {
      console.error('🔴 [AUDIT API] Zod validation error:', error.errors)
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      console.error('🔴 [AUDIT API] Message:', error.message)
      console.error('🔴 [AUDIT API] Stack:', error.stack)
    }

    return NextResponse.json(
      { error: 'Failed to start audit' },
      { status: 500 }
    )
  }
}
