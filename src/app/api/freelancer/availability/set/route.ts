import { supabase } from '../../../../../lib/SupabaseAuthClient'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log("📌 [API HIT] /api/freelancer/set-availability")

  try {
    const body = await request.json()
    console.log("📥 Request Body:", body)

    const { submissionId, availability } = body

    // Get freelancer email from cookies
    console.log("🔍 Reading cookies...")
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")
    console.log("🍪 Session Cookie:", sessionCookie)

    if (!sessionCookie?.value) {
      console.warn("⚠ Unauthorized: No session cookie found")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
      console.log("👤 Parsed Session:", session)
    } catch (err) {
      console.error("❌ Failed to parse session cookie", err)
      return NextResponse.json({ error: 'Invalid session cookie' }, { status: 400 })
    }

    const freelancerEmail = session.email
    console.log("📧 Freelancer Email:", freelancerEmail)

    if (!submissionId || !availability || !Array.isArray(availability)) {
      console.warn("⚠ Missing fields:", { submissionId, availability })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log("🔍 Fetching submission from Supabase...")

    // Check if submission exists and belongs to this freelancer
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
      .eq('email', freelancerEmail)
      .single()

    console.log("📄 Submission Lookup Result:", { submission, submissionError })

    if (submissionError || !submission) {
      console.warn("⚠ Submission not found or does not belong to freelancer")
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Check status
    console.log("📌 Current Submission Status:", submission.status)

    if ((submission.status !== 'selected' && submission.status !== 'accepted') && submission.is_selected !== true) {
      console.warn("⛔ Unauthorized status:", submission.status)
      return NextResponse.json({ error: 'Only selected freelancers can set availability' }, { status: 403 })
    }

    // Validate 3 unique dates
    const uniqueDates = [...new Set(availability.map((slot: any) => slot.date))]
    console.log("🗓 Unique Dates:", uniqueDates)

    if (uniqueDates.length !== 3) {
      console.warn("⛔ Invalid number of dates:", uniqueDates)
      return NextResponse.json({ error: 'Please provide exactly 3 different dates' }, { status: 400 })
    }

    // Validate slots per date
    const slotsByDate = uniqueDates.map(date => 
      availability.filter((slot: any) => slot.date === date).length
    )

    console.log("⏱ Slots Per Date:", slotsByDate)

    if (slotsByDate.some(count => count === 0)) {
      console.warn("⛔ One of the dates has zero slots")
      return NextResponse.json({ error: 'Each date must have at least one time slot' }, { status: 400 })
    }

    // Validate each time slot
    console.log("🧪 Validating each time slot...")

    for (const slot of availability) {
      console.log("➡ Checking slot:", slot)

      if (slot.startTime >= slot.endTime) {
        console.warn("⛔ Invalid time range:", slot)
        return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
      }

      const start = new Date(`2000-01-01T${slot.startTime}`)
      const end = new Date(`2000-01-01T${slot.endTime}`)
      const duration = (end.getTime() - start.getTime()) / (1000 * 60)

      console.log("⏳ Duration:", duration, "mins")

      if (duration < 30) {
        console.warn("⛔ Slot too short:", duration)
        return NextResponse.json({ error: 'Each time slot must be at least 30 minutes' }, { status: 400 })
      }

      if (duration > 120) {
        console.warn("⛔ Slot too long:", duration)
        return NextResponse.json({ error: 'Each time slot must be no more than 2 hours' }, { status: 400 })
      }

      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`)
      const now = new Date()
      const hoursDifference = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      console.log("⏰ Ahead by hours:", hoursDifference)

      if (hoursDifference < 24) {
        console.warn("⛔ Slot not 24h in advance:", slot)
        return NextResponse.json({ error: 'Time slots must be at least 24 hours in advance' }, { status: 400 })
      }
    }

    console.log("✅ All validations passed")
    
    // Generate unique IDs for each slot in the JSON
    const availabilityWithIds = availability.map((slot: any, index: number) => ({
      id: crypto.randomUUID(), // Add unique ID for each slot
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      timezone: slot.timezone || 'UTC',
      status: 'available',
      isBooked: false,
      createdAt: new Date().toISOString(),
      slotIndex: index
    }))

    console.log("🗑 Deleting existing bulk availability for this submission...")
    
    // Delete existing bulk entry (if any)
    const { error: deleteError } = await supabase
      .from('freelancer_availability')
      .delete()
      .eq('submission_id', submissionId)
      .eq('is_bulk_entry', true)

    if (deleteError) {
      console.error("❌ Error deleting old bulk entry:", deleteError)
    }

    console.log("📦 Inserting new bulk availability...")
    
    // Insert new bulk availability entry
    const { error: insertError } = await supabase
      .from('freelancer_availability')
      .insert({
        submission_id: submissionId,
        is_bulk_entry: true,
        availability_data: availabilityWithIds, // JSON array
        slot_count: availability.length,
        dates_summary: uniqueDates,
        timezone: availability[0]?.timezone || 'UTC',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (insertError) {
      console.error("❌ Insert Error:", insertError)
      return NextResponse.json({ error: 'Failed to save availability' }, { status: 500 })
    }

    console.log("📌 Updating submission status...")

    // Update submission status
    const { error: updateError } = await supabase
      .from('freelancer_submissions')
      .update({ 
        status: 'availability_set',
        availability_set_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error("❌ Error updating submission:", updateError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Availability set successfully',
      slotsCount: availability.length,
      datesCount: uniqueDates.length,
      clientEmail: submission.forms?.client_table?.email
    })

  } catch (error) {
    console.error("💥 SERVER ERROR:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}