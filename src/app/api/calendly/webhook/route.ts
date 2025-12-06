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
    console.log('📥 Calendly Webhook Received:', JSON.stringify(payload, null, 2))

    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('calendly-webhook-signature')
    // Add signature verification logic here if needed

    const event = payload.event
    const eventType = payload.event_type
    const invitee = payload.invitee
    const questionsAndAnswers = payload.questions_and_answers || []

    // Extract custom answers to get our internal IDs
    // These would be set when generating the Calendly link
    const customAnswers: any = {}
    questionsAndAnswers.forEach((qa: any) => {
      if (qa.question === 'freelancer_submission_id') customAnswers.submissionId = qa.answer
      if (qa.question === 'form_id') customAnswers.formId = qa.answer
      if (qa.question === 'client_id') customAnswers.clientId = qa.answer
    })

    if (event === 'invitee.created') {
      // Extract submission ID from custom fields or tracking info
      let submissionId = customAnswers.submissionId
      
      // If not in custom fields, try to extract from event name/description
      if (!submissionId && eventType.description) {
        const match = eventType.description.match(/Submission ID: (\S+)/)
        submissionId = match ? match[1] : null
      }

      if (!submissionId) {
        console.error('❌ No submission ID found in Calendly webhook')
        return NextResponse.json({ error: 'Submission ID not found' }, { status: 400 })
      }

      // Get submission details
      const { data: submission, error: submissionError } = await supabase
        .from('freelancer_submissions')
        .select(`
          *,
          forms:form_id (
            *,
            client_table:client_id (*)
          )
        `)
        .eq('id', submissionId)
        .single()

      if (submissionError || !submission) {
        console.error('❌ Submission not found:', submissionError)
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
      }

      // Get freelancer details
      const { data: freelancer, error: freelancerError } = await supabase
        .from('freelancers')
        .select('*')
        .eq('email', submission.email)
        .single()

      if (freelancerError) {
        console.error('❌ Freelancer not found:', freelancerError)
      }

      // Create meeting record
      const meetingData = {
        event_id: payload.event.uuid,
        event_type: eventType.name || 'intro_meeting',
        start_time: new Date(payload.event.start_time).toISOString(),
        end_time: new Date(payload.event.end_time).toISOString(),
        timezone: payload.event.timezone,
        status: 'scheduled',
        invitee_name: invitee.name,
        invitee_email: invitee.email,
        meeting_url: payload.event.location?.join_url || 
                    payload.event.location?.data?.join_url || 
                    payload.event.location?.location,
        cancel_url: invitee.cancel_url,
        reschedule_url: invitee.reschedule_url,
        client_id: submission.forms?.client_id || customAnswers.clientId,
        freelancer_id: freelancer?.id,
        form_id: submission.form_id || customAnswers.formId,
        submission_id: submissionId,
        calendly_data: payload, // Store full payload for reference
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('📝 Creating meeting with data:', meetingData)

      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert(meetingData)
        .select()
        .single()

      if (meetingError) {
        console.error('❌ Error creating meeting:', meetingError)
        return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
      }

      // Update submission status to 'meeting_scheduled'
      const { error: updateError } = await supabase
        .from('freelancer_submissions')
        .update({ 
          status: 'meeting_scheduled',
          meeting_scheduled_at: new Date().toISOString(),
          calendly_link: null, // Clear the calendly link since meeting is scheduled
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (updateError) {
        console.error('❌ Error updating submission:', updateError)
        return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
      }

      // Send notification emails (optional)
      await sendMeetingNotifications(meeting, freelancer, submission.forms?.client_table)

      console.log('✅ Meeting created and submission updated successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Meeting scheduled successfully',
        meetingId: meeting.id 
      })

    } else if (event === 'invitee.canceled') {
      // Find meeting by Calendly event ID
      const { data: existingMeeting, error: findError } = await supabase
        .from('meetings')
        .select('*')
        .eq('event_id', payload.event.uuid)
        .single()

      if (findError || !existingMeeting) {
        console.error('❌ Meeting not found for cancellation:', findError)
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
      }

      // Update meeting status to canceled
      const { error: updateError } = await supabase
        .from('meetings')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('event_id', payload.event.uuid)

      if (updateError) {
        console.error('❌ Error canceling meeting:', updateError)
        return NextResponse.json({ error: 'Failed to cancel meeting' }, { status: 500 })
      }

      // Update submission status back to 'calendly_link_shared'
      const { error: submissionError } = await supabase
        .from('freelancer_submissions')
        .update({ 
          status: 'calendly_link_shared',
          meeting_scheduled_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMeeting.submission_id)

      if (submissionError) {
        console.error('❌ Error updating submission after cancellation:', submissionError)
      }

      // Send cancellation notifications (optional)
      await sendCancellationNotifications(existingMeeting)

      console.log('✅ Meeting canceled successfully')
      return NextResponse.json({ success: true, message: 'Meeting canceled' })

    } else if (event === 'invitee.rescheduled') {
      // Handle rescheduled meetings
      const { data: existingMeeting, error: findError } = await supabase
        .from('meetings')
        .select('*')
        .eq('event_id', payload.event.uuid)
        .single()

      if (findError || !existingMeeting) {
        console.error('❌ Meeting not found for reschedule:', findError)
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
      }

      // Update meeting with new time
      const { error: updateError } = await supabase
        .from('meetings')
        .update({ 
          start_time: new Date(payload.event.start_time).toISOString(),
          end_time: new Date(payload.event.end_time).toISOString(),
          timezone: payload.event.timezone,
          meeting_url: payload.event.location?.join_url || 
                      payload.event.location?.data?.join_url || 
                      payload.event.location?.location,
          updated_at: new Date().toISOString()
        })
        .eq('event_id', payload.event.uuid)

      if (updateError) {
        console.error('❌ Error updating rescheduled meeting:', updateError)
        return NextResponse.json({ error: 'Failed to update rescheduled meeting' }, { status: 500 })
      }

      // Send reschedule notifications (optional)
      await sendRescheduleNotifications(existingMeeting, payload.event)

      console.log('✅ Meeting rescheduled successfully')
      return NextResponse.json({ success: true, message: 'Meeting rescheduled' })

    } else if (event === 'invitee.no_show') {
      // Handle no-show
      const { error } = await supabase
        .from('meetings')
        .update({ 
          status: 'no_show',
          updated_at: new Date().toISOString()
        })
        .eq('event_id', payload.event.uuid)

      if (error) {
        console.error('❌ Error marking meeting as no-show:', error)
        return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 })
      }

      console.log('✅ Meeting marked as no-show')
      return NextResponse.json({ success: true, message: 'Meeting marked as no-show' })

    } else {
      console.log(`ℹ️ Unhandled Calendly event: ${event}`)
      return NextResponse.json({ success: true, message: 'Event received but not processed' })
    }

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions for notifications
async function sendMeetingNotifications(meeting: any, freelancer: any, client: any) {
  try {
    // Implement email sending logic here
    // You can use Nodemailer, SendGrid, Resend, etc.
    
    console.log('📧 Sending meeting notifications:')
    console.log('- Meeting:', meeting.id)
    console.log('- Freelancer:', freelancer?.email)
    console.log('- Client:', client?.email)
    
    // Example using Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: [freelancer.email, client.email],
      subject: 'Meeting Scheduled Successfully',
      html: `
        <h2>Meeting Scheduled</h2>
        <p><strong>Date:</strong> ${new Date(meeting.start_time).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(meeting.start_time).toLocaleTimeString()}</p>
        <p><strong>Duration:</strong> 30 minutes</p>
        <p><strong>Meeting Link:</strong> <a href="${meeting.meeting_url}">Join Meeting</a></p>
      `
    });
    */
  } catch (error) {
    console.error('❌ Error sending notifications:', error)
  }
}

async function sendCancellationNotifications(meeting: any) {
  try {
    console.log('📧 Sending cancellation notifications for meeting:', meeting.id)
    // Implement cancellation email logic
  } catch (error) {
    console.error('❌ Error sending cancellation notifications:', error)
  }
}

async function sendRescheduleNotifications(meeting: any, newEvent: any) {
  try {
    console.log('📧 Sending reschedule notifications for meeting:', meeting.id)
    // Implement reschedule email logic
  } catch (error) {
    console.error('❌ Error sending reschedule notifications:', error)
  }
}