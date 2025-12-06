import { supabase } from '../../../../../lib/SupabaseAuthClient'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log("📌 [API HIT] /api/freelancer/availability/get")

  try {
    const url = new URL(request.url)
    const submissionId = url.searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 })
    }

    // Get freelancer email from cookies
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid session cookie' }, { status: 400 })
    }

    const freelancerEmail = session.email

    // Verify submission belongs to freelancer
    const { data: submission, error: submissionError } = await supabase
      .from('freelancer_submissions')
      .select('id')
      .eq('id', submissionId)
      .eq('email', freelancerEmail)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    console.log("🔍 Fetching bulk availability...")
    
    // Try to get bulk availability first
    const { data: bulkAvailability, error: bulkError } = await supabase
      .from('freelancer_availability')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('is_bulk_entry', true)
      .single()

    console.log("📦 Bulk Availability Result:", { bulkAvailability, bulkError })

    if (bulkAvailability && !bulkError) {
      console.log("✅ Found bulk availability entry")
      
      // Transform bulk data to match frontend format
      const availabilitySlots = bulkAvailability.availability_data?.map((slot: any) => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: slot.timezone,
        slotId: slot.id // Keep the slot ID for client selection
      })) || []

      return NextResponse.json({
        availability: availabilitySlots,
        isBulk: true,
        summary: {
          total_slots: bulkAvailability.slot_count,
          unique_dates: bulkAvailability.dates_summary,
          timezone: bulkAvailability.timezone,
          last_updated: bulkAvailability.updated_at
        }
      })
    }

    console.log("⚠ No bulk entry found, checking individual slots...")
    
    // Fallback: Check for individual slots (for backward compatibility)
    const { data: individualSlots, error: individualError } = await supabase
      .from('freelancer_availability')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('is_bulk_entry', false)
      .eq('is_booked', false) // Only get available slots

    console.log("📋 Individual Slots Result:", { individualSlots, individualError })

    if (individualError) {
      console.error("❌ Error fetching individual slots:", individualError)
    }

    const availabilityFromIndividual = individualSlots?.map((slot: any) => ({
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      timezone: slot.timezone,
      slotId: slot.id
    })) || []

    return NextResponse.json({
      availability: availabilityFromIndividual,
      isBulk: false,
      summary: {
        total_slots: availabilityFromIndividual.length,
        unique_dates: [...new Set(availabilityFromIndividual.map((s: any) => s.date))],
        last_updated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("💥 SERVER ERROR:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}