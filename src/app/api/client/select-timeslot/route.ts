// app/api/client/select-timeslot/route.ts
import { supabase } from "../../../../lib/SupabaseAuthClient"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "../../../../lib/nodemailer"

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":")
  const hour = Number.parseInt(hours)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${suffix}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export async function POST(request: NextRequest) {
  console.log("🔍 [API HIT] /api/client/select-timeslot")

  try {
    const body = await request.json()
    console.log("📥 Request body:", body)

    const { submissionId, slotId, clientNotes } = body

    if (!submissionId || !slotId) {
      console.warn("⚠ Missing required fields")
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "submissionId and slotId are required",
        },
        { status: 400 },
      )
    }

    console.log("🔍 Processing request:", { submissionId, slotId })

    // Get client info from cookies
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie?.value) {
      console.warn("⚠ No client_auth cookie found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
      console.log("👤 Parsed session:", {
        id: session.id,
        email: session.email,
        name: session.name,
      })
    } catch (err) {
      console.error("❌ Failed to parse session cookie:", err)
      return NextResponse.json({ error: "Invalid session cookie" }, { status: 400 })
    }

    const clientId = session.id
    const clientName = session.name
    const clientEmail = session.email

    if (!clientId) {
      console.error("❌ No client ID in session")
      return NextResponse.json(
        {
          error: "Invalid client session",
          details: "No client ID found",
        },
        { status: 401 },
      )
    }

    console.log("✅ Authenticated client:", { clientId, clientName, clientEmail })

    // Get submission details
    console.log("🔍 Fetching submission details...")
    const { data: submission, error: submissionError } = await supabase
      .from("freelancer_submissions")
      .select(`
        id,
        form_id,
        name,
        email,
        is_selected,
        status,
        created_at,
        updated_at
      `)
      .eq("id", submissionId)
      .single()

    console.log("📄 Submission lookup:", {
      hasSubmission: !!submission,
      error: submissionError?.message,
    })

    if (submissionError || !submission) {
      console.error("❌ Submission not found:", submissionError)
      return NextResponse.json(
        {
          error: "Submission not found",
          details: `Submission with ID ${submissionId} not found`,
        },
        { status: 404 },
      )
    }

    console.log("✅ Submission found:", {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      is_selected: submission.is_selected,
      status: submission.status,
      form_id: submission.form_id,
    })

    // Check ownership by getting the form data
    console.log("🔍 Checking form ownership...")
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("id, form_name, client_id, created_by")
      .eq("id", submission.form_id)
      .single()

    console.log("📋 Form data:", {
      form,
      error: formError?.message,
    })

    // TESTING MODE: For testing with same email
    if (clientEmail === submission.email) {
      console.log("✅ Same email - testing mode active")
    } else if (form) {
      // Check if client owns the form
      if (form.client_id !== clientId) {
        console.warn("⚠ Client doesn't own this form")
        console.log("Form client_id:", form.client_id)
        console.log("Authenticated client_id:", clientId)

        // Also check created_by (might be a string)
        if (form.created_by !== clientId && form.created_by !== clientEmail) {
          return NextResponse.json(
            {
              error: "Unauthorized access",
              details: "This submission does not belong to your account",
            },
            { status: 403 },
          )
        }
      }
    } else {
      console.warn("⚠ Form not found for submission")
    }

    // Check if freelancer is selected
    console.log("📋 Checking freelancer status...")
    console.log("Is selected:", submission.is_selected)
    console.log("Status:", submission.status)

    if (!submission.is_selected && submission.status !== "selected") {
      console.warn("⚠ Freelancer not selected yet")
      return NextResponse.json(
        {
          error: "Freelancer not selected yet",
          details: "You need to select this freelancer first",
        },
        { status: 400 },
      )
    }

    console.log("✅ Freelancer is selected - looking for availability...")

    // First, try to find the slot in bulk availability
    console.log("🔍 Looking for slot in bulk availability...")
    const { data: bulkAvailability, error: bulkError } = await supabase
      .from("freelancer_availability")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("is_bulk_entry", true)
      .single()

    console.log("📦 Bulk availability result:", {
      hasData: !!bulkAvailability,
      error: bulkError?.message,
      slot_count: bulkAvailability?.slot_count,
    })

    // DEBUG: Check availability_data structure
    if (bulkAvailability) {
      console.log("🔍 DEBUG availability_data:", {
        type: typeof bulkAvailability.availability_data,
        isArray: Array.isArray(bulkAvailability.availability_data),
        value: bulkAvailability.availability_data,
        rawLength: bulkAvailability.availability_data?.length || 0,
      })

      // Try to parse if it's a string
      if (typeof bulkAvailability.availability_data === "string") {
        try {
          const parsed = JSON.parse(bulkAvailability.availability_data)
          console.log("✅ Parsed availability_data from string:", {
            isArray: Array.isArray(parsed),
            length: Array.isArray(parsed) ? parsed.length : "N/A",
          })
        } catch (e) {
          console.error("❌ Failed to parse availability_data:", e)
        }
      }
    }

    let selectedSlot: any = null
    let slotFound = false

    if (bulkAvailability && !bulkError) {
      // Handle availability_data properly - it's JSONB but might need parsing
      let slots: any[] = []

      if (bulkAvailability.availability_data) {
        if (Array.isArray(bulkAvailability.availability_data)) {
          slots = bulkAvailability.availability_data
          console.log("✅ availability_data is already an array")
        } else if (typeof bulkAvailability.availability_data === "string") {
          try {
            slots = JSON.parse(bulkAvailability.availability_data)
            console.log("✅ Parsed availability_data from string")
          } catch (parseError) {
            console.error("❌ Failed to parse availability_data:", parseError)
            slots = []
          }
        } else {
          console.log("⚠ availability_data is unexpected type:", typeof bulkAvailability.availability_data)
          slots = []
        }
      }

      console.log(`🔄 Searching through ${slots.length} slots for ID: ${slotId}`)

      // Debug: log all slot IDs
      console.log("📊 All slot IDs in bulk data:")
      if (slots.length > 0) {
        slots.forEach((slot: any, index: number) => {
          console.log(`  Slot ${index}: ID="${slot.id}"`, {
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            match: slot.id === slotId,
          })
        })
      } else {
        console.log("  No slots in the array")
      }

      selectedSlot = slots.find((s: any) => s.id === slotId)

      if (selectedSlot) {
        console.log("✅ Found slot in bulk data:", selectedSlot)
        slotFound = true

        // Mark the selected slot as booked within the availability_data array
        const updatedSlots = slots.map((s: any) => {
          if (s.id === slotId) {
            return {
              ...s,
              isBooked: true,
              status: "selected_by_client",
              selectedAt: new Date().toISOString(),
              selectedByClientId: clientId,
            }
          }
          return s
        })

        console.log(`🔄 Updating bulk entry - SAME ROW, no new row created`)

        // Update the bulk entry with selected slot details in main columns
        const { error: updateError } = await supabase
          .from("freelancer_availability")
          .update({
            // Store selected slot in main columns for easy querying
            date: selectedSlot.date,
            start_time: selectedSlot.startTime,
            end_time: selectedSlot.endTime,
            timezone: selectedSlot.timezone || bulkAvailability.timezone || "UTC",
            is_booked: true,
            status: "selected_by_client",
            selected_by_client_id: clientId,
            selected_at: new Date().toISOString(),
            client_notes: clientNotes || null,
            updated_at: new Date().toISOString(),
            // Keep all slots in availability_data with the selected one marked
            availability_data: updatedSlots,
            // Update dates_summary to show remaining unbooked dates
            dates_summary: [...new Set(updatedSlots.filter((s: any) => !s.isBooked).map((s: any) => s.date))],
          })
          .eq("id", bulkAvailability.id)

        if (updateError) {
          console.error("❌ Error updating bulk availability:", updateError)
          return NextResponse.json(
            {
              error: "Failed to update availability",
              details: updateError.message,
            },
            { status: 500 },
          )
        } else {
          console.log("✅ Bulk availability updated successfully - NO NEW ROW CREATED!")
        }

        // Store the bulk entry ID for submission update
        selectedSlot.dbId = bulkAvailability.id
      } else {
        console.log(`❌ Slot ID "${slotId}" not found in bulk data`)
      }
    } else {
      console.log("⚠ No bulk availability found or error:", bulkError?.message)
    }

    // If not found in bulk, check individual slots (legacy support)
    if (!slotFound) {
      console.log("🔍 Slot not found in bulk, checking individual slots...")
      const { data: individualSlots, error: individualError } = await supabase
        .from("freelancer_availability")
        .select("*")
        .eq("submission_id", submissionId)
        .eq("is_bulk_entry", false)
        .eq("is_booked", false)

      console.log("📋 Individual slots found:", individualSlots?.length || 0)

      if (individualSlots && individualSlots.length > 0) {
        console.log("📊 All individual slot IDs:")
        individualSlots.forEach((slot: any, index: number) => {
          console.log(`  Slot ${index}: ID="${slot.id}"`, {
            date: slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            match: slot.id === slotId,
          })
        })

        const slot = individualSlots.find((s: any) => s.id === slotId)

        if (slot) {
          console.log("✅ Found slot in individual slots:", slot)
          selectedSlot = {
            date: slot.date,
            startTime: slot.start_time,
            endTime: slot.end_time,
            timezone: slot.timezone,
            dbId: slot.id,
          }
          slotFound = true

          // Update existing slot as booked (no new row)
          console.log("📝 Marking individual slot as booked...")
          const { error: updateError } = await supabase
            .from("freelancer_availability")
            .update({
              is_booked: true,
              status: "selected_by_client",
              selected_by_client_id: clientId,
              selected_at: new Date().toISOString(),
              client_notes: clientNotes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", slotId)

          if (updateError) {
            console.error("❌ Error updating slot:", updateError)
            return NextResponse.json(
              {
                error: "Failed to book slot",
                details: updateError.message,
              },
              { status: 500 },
            )
          }

          console.log("✅ Individual slot updated as booked")
        } else {
          console.log(`❌ Slot ID "${slotId}" not found in individual slots`)
        }
      } else {
        console.log("⚠ No individual slots found or error:", individualError?.message)
      }
    }

    if (!slotFound) {
      console.error("❌ Slot not found through any method")

      // Let's check what's actually in the database
      console.log("🔍 Debug: Checking all availability records...")
      const { data: allAvailability, error: allError } = await supabase
        .from("freelancer_availability")
        .select("*")
        .eq("submission_id", submissionId)

      console.log("📊 All availability records count:", allAvailability?.length || 0)
      if (allAvailability) {
        allAvailability.forEach((a: any, i: number) => {
          const availabilityData = a.availability_data
          let slotCount = 0
          let slotIds: string[] = []

          if (availabilityData) {
            if (Array.isArray(availabilityData)) {
              slotCount = availabilityData.length
              slotIds = availabilityData.map((s: any) => s.id)
            } else if (typeof availabilityData === "string") {
              try {
                const parsed = JSON.parse(availabilityData)
                if (Array.isArray(parsed)) {
                  slotCount = parsed.length
                  slotIds = parsed.map((s: any) => s.id)
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }

          console.log(`  Record ${i}:`, {
            id: a.id,
            is_bulk_entry: a.is_bulk_entry,
            is_booked: a.is_booked,
            slot_count: a.slot_count,
            parsed_slot_count: slotCount,
            date: a.date,
            start_time: a.start_time,
            end_time: a.end_time,
            slot_ids: slotIds,
          })
        })
      }

      return NextResponse.json(
        {
          error: "Time slot not found",
          details: "The selected time slot was not found in the database",
          debug: {
            requestedSlotId: slotId,
            submissionId: submissionId,
            availableRecords: allAvailability?.length || 0,
            bulkEntryExists: !!bulkAvailability,
          },
        },
        { status: 404 },
      )
    }

    // Update submission status
    console.log("📝 Updating submission status...")
    const { error: updateSubmissionError } = await supabase
      .from("freelancer_submissions")
      .update({
        status: "time_slot_selected",
        time_slot_selected_at: new Date().toISOString(),
        selected_time_slot_id: selectedSlot.dbId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId)

    if (updateSubmissionError) {
      console.error("❌ Error updating submission:", updateSubmissionError)
      return NextResponse.json(
        {
          error: "Failed to update submission",
          details: updateSubmissionError.message,
        },
        { status: 500 },
      )
    } else {
      console.log("✅ Submission status updated to 'time_slot_selected'")
    }

    try {
      const projectName = form?.form_name || "Project"

      // Get admin emails from environment variable
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") || ["admin@example.com"]

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fbf5e5;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #241C15; margin: 0;">📅 New Interview Time Slot Selected</h2>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #241C15; margin-top: 0; border-bottom: 2px solid #FFE01B; padding-bottom: 10px;">Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Project:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Freelancer:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${submission.name} (${submission.email})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Client:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${clientName} (${clientEmail})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Selected Date:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${formatDate(selectedSlot.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Timezone:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${selectedSlot.timezone || "UTC"}</td>
              </tr>
              ${
                clientNotes
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Client Notes:</strong></td>
                <td style="padding: 8px 0; color: #241C15;">${clientNotes}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          <div style="background: #FFE01B; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #241C15; font-weight: bold;">
              Please schedule the meeting via Calendly as soon as possible.
            </p>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px; text-align: center;">
            This is an automated notification from the Freelancer Management System.
          </p>
        </div>
      `

      await sendEmail({
        to: adminEmails,
        subject: `🚀 New Interview Time Slot Selected - ${projectName} - ${submission.name}`,
        html: emailHtml,
      })

      console.log("✅ Admin notification email sent")
    } catch (emailError) {
      console.warn("⚠ Email sending failed:", emailError)
      // Don't fail the request if email fails
    }

    console.log("🎉 Time slot selection completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Time slot selected successfully! Admin has been notified to schedule the meeting.",
      selectedSlot: {
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        timezone: selectedSlot.timezone,
      },
      submission: {
        id: submission.id,
        name: submission.name,
        status: "time_slot_selected",
      },
    })
  } catch (error) {
    console.error("💥 SERVER ERROR in select-timeslot:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
