// app/api/client/freelancer-availability/route.ts
import { supabase } from '../../../../lib/SupabaseAuthClient'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
  console.log("[v0] [API HIT] /api/client/freelancer-availability")

  try {
    const url = new URL(request.url)
    const submissionId = url.searchParams.get("submissionId")

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID required" }, { status: 400 })
    }

    // Get client session from cookies
    const cookieStore = await cookies()
    const clientAuthCookie = cookieStore.get("client_auth")

    if (!clientAuthCookie?.value) {
      return NextResponse.json(
        {
          error: "Unauthorized - Please log in as a client",
          message: "No client authentication found",
        },
        { status: 401 },
      )
    }

    let clientData
    try {
      clientData = JSON.parse(clientAuthCookie.value)
    } catch (err) {
      return NextResponse.json(
        {
          error: "Invalid client session",
          message: "Please log in again",
        },
        { status: 400 },
      )
    }

    const clientId = clientData.id
    if (!clientId) {
      return NextResponse.json(
        {
          error: "Invalid client session",
          message: "No client ID found in session",
        },
        { status: 401 },
      )
    }

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from("freelancer_submissions")
      .select(`
        id, 
        form_id, 
        name, 
        email, 
        is_selected, 
        status
      `)
      .eq("id", submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        {
          error: "Submission not found",
          details: `Submission with ID ${submissionId} not found`,
        },
        { status: 404 },
      )
    }

    if (!submission.is_selected && submission.status !== "selected") {
      return NextResponse.json(
        {
          error: "Freelancer not selected yet",
          details: "You need to select this freelancer first",
          canSelect: true,
        },
        { status: 400 },
      )
    }

    // Try to get bulk availability first
    const { data: bulkAvailability, error: bulkError } = await supabase
      .from("freelancer_availability")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("is_bulk_entry", true)
      .single()

    console.log("[v0] Bulk availability lookup:", {
      hasData: !!bulkAvailability,
      error: bulkError?.message,
    })

    if (bulkAvailability && !bulkError) {
      // Parse availability_data
      let slots: any[] = []

      if (bulkAvailability.availability_data) {
        if (Array.isArray(bulkAvailability.availability_data)) {
          slots = bulkAvailability.availability_data
        } else if (typeof bulkAvailability.availability_data === "string") {
          try {
            slots = JSON.parse(bulkAvailability.availability_data)
          } catch (e) {
            console.error("[v0] Failed to parse availability_data:", e)
            slots = []
          }
        }
      }

      const availabilitySlots = slots
        .filter((slot: any) => {
          // Must have all required fields
          const hasRequiredFields = slot.id && slot.date && slot.startTime && slot.endTime
          // Must be available
          const isAvailable = slot.status === "available" && !slot.isBooked

          if (!hasRequiredFields) {
            console.warn("[v0] Skipping slot with missing fields:", slot)
          }

          return hasRequiredFields && isAvailable
        })
        .map((slot: any) => ({
          id: slot.id, // Use the EXACT ID from storage, never generate a new one
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone || bulkAvailability.timezone || "UTC",
          status: slot.status || "available",
          duration: calculateDuration(slot.startTime, slot.endTime),
        }))

      console.log("[v0] Returning slots:", availabilitySlots.length)
      console.log(
        "[v0] Slot IDs:",
        availabilitySlots.map((s: any) => s.id),
      )

      return NextResponse.json({
        success: true,
        availability: availabilitySlots,
        isBulk: true,
        freelancerName: submission.name,
        freelancerEmail: submission.email,
        submissionId: submissionId,
        summary: {
          totalSlots: bulkAvailability.slot_count,
          availableSlots: availabilitySlots.length,
          uniqueDates: bulkAvailability.dates_summary,
          timezone: bulkAvailability.timezone,
          lastUpdated: bulkAvailability.updated_at,
        },
      })
    }

    // Fallback: Check for individual slots
    const { data: individualSlots, error: individualError } = await supabase
      .from("freelancer_availability")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("is_bulk_entry", false)
      .eq("is_booked", false)

    const availabilityFromIndividual = (individualSlots || [])
      .filter((slot: any) => slot.date && slot.start_time && slot.end_time)
      .map((slot: any) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        timezone: slot.timezone || "UTC",
        status: slot.status,
        duration: calculateDuration(slot.start_time, slot.end_time),
      }))

    if (availabilityFromIndividual.length === 0 && !bulkAvailability) {
      return NextResponse.json(
        {
          success: false,
          error: "No availability set",
          message: "The freelancer has not set their availability yet",
          freelancerName: submission.name,
          submissionId: submissionId,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      availability: availabilityFromIndividual,
      isBulk: false,
      freelancerName: submission.name,
      freelancerEmail: submission.email,
      submissionId: submissionId,
      summary: {
        totalSlots: availabilityFromIndividual.length,
        availableSlots: availabilityFromIndividual.length,
        uniqueDates: [...new Set(availabilityFromIndividual.map((s: any) => s.date))],
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] SERVER ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function calculateDuration(startTime: string, endTime: string): string {
  try {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60)

    if (duration < 60) {
      return `${duration} min`
    } else if (duration === 60) {
      return "1 hr"
    } else {
      return `${(duration / 60).toFixed(1)} hrs`
    }
  } catch {
    return "N/A"
  }
}