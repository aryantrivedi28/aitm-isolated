import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerEmail = session.email

    if (!freelancerEmail) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 })
    }

    // Fetch submissions with all necessary fields including meetings
    const { data: submissions, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .select(`
        id,
        form_id,
        created_at,
        proposal_link,
        profile_rating,
        status,
        is_selected,
        meeting_scheduled,
        meeting_id,
        availability_set_at,
        meeting_scheduled_at,
        calendly_link,
        forms:form_id (
          id,
          form_name,
          form_description,
          client_table (
            id,
            name,
            company_name
          )
        ),
        meetings:meeting_id (
          id,
          event_id,
          event_type,
          start_time,
          end_time,
          timezone,
          status,
          invitee_name,
          invitee_email,
          meeting_url,
          cancel_url,
          reschedule_url,
          canceled_at,
          calendly_data
        )
      `)
      .eq("email", freelancerEmail)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [DEBUG] Supabase error:", error)
      return NextResponse.json({ 
        success: false,
        error: error.message 
      }, { status: 500 })
    }

    // Transform the data for easier frontend usage
    const transformedSubmissions = submissions.map(sub => {
      const meeting = sub.meetings?.[0] || null
      
      // Determine the correct status
      let status = sub.status || 'pending'
      
      // If meeting is scheduled, override status
      if (meeting && meeting.status === 'scheduled' && !meeting.canceled_at) {
        status = 'meeting_scheduled'
      }
      // If is_selected is true but status isn't updated yet
      else if (sub.is_selected === true && !['selected', 'accepted'].includes(status.toLowerCase())) {
        status = 'selected'
      }
      
      return {
        ...sub,
        status,
        meeting_scheduled: sub.meeting_scheduled || false,
        meeting: meeting
      }
    })

    return NextResponse.json({ 
      success: true,
      submissions: transformedSubmissions 
    })
  } catch (error) {
    console.error("❌ [DEBUG] Get submissions error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}