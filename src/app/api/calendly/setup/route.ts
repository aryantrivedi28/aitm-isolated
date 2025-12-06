import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/SupabaseAuthClient'


const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY
const CALENDLY_USER_URI = process.env.CALENDLY_USER_URI

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Get freelancer details
    const { data: freelancer, error: freelancerError } = await supabase
      .from('freelancers')
      .select('*')
      .eq('email', submission.email)
      .single()

    if (freelancerError) {
      console.error('Freelancer not found:', freelancerError)
    }

    // Create Calendly scheduling link with custom questions
    const calendlyResponse = await fetch('https://api.calendly.com/scheduling_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CALENDLY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        max_event_count: 1,
        owner: CALENDLY_USER_URI,
        owner_type: 'EventType',
        event_type: '30min', // Your Calendly event type
        invitee_email: submission.forms?.client_table?.email,
        questions: [
          {
            name: "freelancer_submission_id",
            type: "string",
            position: 0,
            enabled: false,
            required: false,
            answer_choices: [],
            include_other: false,
            answer: submissionId
          },
          {
            name: "form_id",
            type: "string",
            position: 1,
            enabled: false,
            required: false,
            answer_choices: [],
            include_other: false,
            answer: submission.form_id
          },
          {
            name: "client_id",
            type: "string",
            position: 2,
            enabled: false,
            required: false,
            answer_choices: [],
            include_other: false,
            answer: submission.forms?.client_id
          }
        ]
      })
    })

    const calendlyData = await calendlyResponse.json()

    if (!calendlyResponse.ok) {
      console.error('Calendly API error:', calendlyData)
      return NextResponse.json({ 
        error: calendlyData.message || 'Failed to create Calendly link' 
      }, { status: 500 })
    }

    // Save initial meeting record (pending status)
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        event_id: `pending_${Date.now()}_${submissionId}`,
        event_type: 'calendly_pending',
        status: 'pending',
        invitee_email: submission.forms?.client_table?.email,
        meeting_url: calendlyData.resource.booking_url,
        cancel_url: calendlyData.resource.cancel_url,
        reschedule_url: calendlyData.resource.reschedule_url,
        client_id: submission.forms?.client_id,
        freelancer_id: freelancer?.id,
        form_id: submission.form_id,
        submission_id: submissionId,
        calendly_data: calendlyData.resource,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (meetingError) {
      console.error('Error saving meeting:', meetingError)
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('freelancer_submissions')
      .update({ 
        status: 'calendly_link_shared',
        calendly_link: calendlyData.resource.booking_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error('Error updating submission:', updateError)
    }

    return NextResponse.json({ 
      success: true,
      calendlyLink: calendlyData.resource.booking_url,
      meetingId: meeting?.id,
      message: 'Calendly link created successfully'
    })

  } catch (error) {
    console.error('Error creating Calendly link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}