import { NextRequest, NextResponse } from 'next/server'
import { sendAuditEmail } from '../../../../lib/emails/nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { auditId } = await request.json()
    
    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      )
    }
    
    await sendAuditEmail(auditId)
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    })
    
  } catch (error) {
    console.error('Email API error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send email',
        success: false 
      },
      { status: 500 }
    )
  }
}