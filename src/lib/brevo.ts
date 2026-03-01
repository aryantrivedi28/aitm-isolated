type AuditData = {
  id: string
  email: string
  store_url?: string
  overall_score?: number
}

const LIST_ID = 3

export async function addContactToBrevo(audit: AuditData) {

  try {

    console.log("========== BREVO DEBUG START ==========")

    console.log("Email:", audit.email)
    console.log("Audit ID:", audit.id)
    console.log("Store URL:", audit.store_url)
    console.log("Score:", audit.overall_score)

    console.log("BREVO API KEY EXISTS:",
      !!process.env.BREVO_API_KEY
    )


    const payload = {

      email: audit.email,

      listIds: [LIST_ID],

      updateEnabled: true,

      attributes: {

        STORE_URL: audit.store_url ?? "",

        AUDIT_ID: audit.id ?? "",

        OVERALL_SCORE: audit.overall_score ?? 0

      }

    }

    console.log("Payload sent to Brevo:")
    console.log(JSON.stringify(payload, null, 2))


    const response = await fetch(
      "https://api.brevo.com/v3/contacts",
      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "api-key": process.env.BREVO_API_KEY!

        },

        body: JSON.stringify(payload)

      }
    )


    console.log("Brevo Status:", response.status)

    const text = await response.text()

    console.log("Brevo Raw Response:", text)

    console.log("========== BREVO DEBUG END ==========")


    if (!response.ok) {

      throw new Error(text || "Brevo request failed")

    }

    return true


  } catch (error: any) {

    console.error("❌ Brevo Error:", error.message)

    throw error

  }

}