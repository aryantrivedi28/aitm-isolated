// app/api/calendly/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('calendly-webhook-signature')
    // Add signature verification logic here

    const event = payload.event
    const eventType = payload.event_type
    const invitee = payload.invitee
    const questionsAndAnswers = payload.questions_and_answers || []

    // Extract custom answers to get our internal IDs
    const customAnswers: any = {}
    questionsAndAnswers.forEach((qa: any) => {
      if (qa.question === 'a1') customAnswers.freelancerId = qa.answer
      if (qa.question === 'a2') customAnswers.formId = qa.answer
      if (qa.question === 'a3') customAnswers.submissionId = qa.answer
    })

    if (event === 'invitee.created') {
      // Create new meeting
      const { data: meeting, error } = await supabase
        .from('meetings')
        .insert({
          event_id: payload.event.uuid,
          event_type: eventType.name,
          start_time: new Date(payload.event.start_time),
          end_time: new Date(payload.event.end_time),
          timezone: payload.event.timezone,
          status: 'scheduled',
          invitee_name: invitee.name,
          invitee_email: invitee.email,
          meeting_url: payload.event.location?.join_url || payload.event.location?.data?.join_url,
          cancel_url: invitee.cancel_url,
          reschedule_url: invitee.reschedule_url,
          client_id: payload.event.memberships?.find((m: any) => m.user_email === invitee.email)?.user_id,
          freelancer_id: customAnswers.freelancerId,
          form_id: customAnswers.formId,
          submission_id: customAnswers.submissionId,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating meeting:', error)
        return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
      }

      // Update submission to mark as having meeting scheduled
      await supabase
        .from('submissions')
        .update({ 
          meeting_scheduled: true,
          meeting_id: meeting.id 
        })
        .eq('id', customAnswers.submissionId)

    } else if (event === 'invitee.canceled') {
      // Update meeting status to canceled
      const { error } = await supabase
        .from('meetings')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('event_id', payload.event.uuid)

      if (error) {
        console.error('Error canceling meeting:', error)
        return NextResponse.json({ error: 'Failed to cancel meeting' }, { status: 500 })
      }

      // Update submission
      await supabase
        .from('submissions')
        .update({ meeting_scheduled: false })
        .eq('meeting_id', payload.event.uuid)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}