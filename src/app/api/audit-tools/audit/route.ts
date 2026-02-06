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
  try {
    const body = await request.json()
    const { email, storeUrl, name } = auditSchema.parse(body)

    const audit = await AuditDB.createAuditRecord(email, storeUrl, name)

    try {
      const result = await runCompleteAudit(storeUrl)

      await AuditDB.saveAuditResults(audit.id, result)

      return NextResponse.json({
        success: true,
        auditId: audit.id,
        status: 'completed'
      })

    } catch (err) {
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message: String(err),
          completed_at: new Date().toISOString()
        })
        .eq('id', audit.id)

      return NextResponse.json({
        success: false,
        error: 'Audit failed'
      })
    }

  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

