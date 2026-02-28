import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuditDB, supabase } from '../../../../lib/db/supabase'
import { runCompleteAudit } from '../../../../lib/audit-engine'
import { addContactToBrevo } from '../../../../lib/brevo'

/**
 * Request validation schema
 */
const auditSchema = z.object({
  email: z.string().email('Valid email required'),
  storeUrl: z.string().url('Valid store URL required'),
  name: z.string().optional(),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {
  let auditId: string | null = null

  try {
    const body = await request.json()
    const { email, storeUrl, name } = auditSchema.parse(body)

    // Create audit record
    const audit = await AuditDB.createAuditRecord(email, storeUrl, name)
    auditId = audit.id

    try {
      // Run audit engine
      const result = await runCompleteAudit(storeUrl)

      // Save success result
      await AuditDB.saveAuditResults(audit.id, result)

      await supabase
        .from('audits')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', audit.id)

      /**
       * 🔥 Send contact to Brevo
       */
      // Fetch updated audit record
      const { data: updatedAudit } = await supabase
        .from('audits')
        .select('*')
        .eq('id', audit.id)
        .single()

      if (
        updatedAudit &&
        updatedAudit.status === 'completed' &&
        !updatedAudit.is_email_sent
      ) {
        try {
          await addContactToBrevo(updatedAudit)

          await supabase
            .from('audits')
            .update({ is_email_sent: true })
            .eq('id', audit.id)

          console.log('📩 Email automation triggered')
        } catch (brevoError) {
          console.error('Brevo integration failed:', brevoError)
        }
      }
      return NextResponse.json({
        success: true,
        auditId: audit.id,
        status: 'completed'
      })
    } catch (engineError: unknown) {
      const debugMessage =
        engineError instanceof Error
          ? engineError.message
          : 'Unknown audit engine error'

      // Update audit as failed
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message: debugMessage,
          completed_at: new Date().toISOString()
        })
        .eq('id', audit.id)

      return NextResponse.json(
        {
          success: false,
          code: 'AUDIT_FAILED',
          userMessage:
            'We couldn’t complete the audit. The store may be private, password-protected, or blocking crawlers.',
          debugMessage:
            process.env.NODE_ENV === 'development'
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
        : 'Invalid request payload'

    // If audit was created but something failed before engine
    if (auditId) {
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message: debugMessage,
          completed_at: new Date().toISOString()
        })
        .eq('id', auditId)
    }

    return NextResponse.json(
      {
        success: false,
        code: 'INVALID_REQUEST',
        userMessage:
          'Invalid input. Please check your details and try again.',
        debugMessage:
          process.env.NODE_ENV === 'development'
            ? debugMessage
            : undefined
      },
      { status: 400 }
    )
  }
}