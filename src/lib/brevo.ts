type AuditData = {
  id: string
  email: string
  store_url?: string
  overall_score?: number
  critical_issues?: number
}

const LIST_ID = 3
const TEMPLATE_ID = 3

export async function addContactToBrevo(audit: AuditData) {

  try {

    console.log("========== BREVO DEBUG START ==========")

    console.log("Email:", audit.email)
    console.log("Audit ID:", audit.id)
    console.log("Store URL:", audit.store_url)
    console.log("Overall Score:", audit.overall_score)
    console.log("Critical Issues:", audit.critical_issues)

    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      throw new Error("BREVO_API_KEY missing")
    }

    /**
     * STEP 1 — Add Contact
     */

    const contactPayload = {

      email: audit.email,

      listIds: [LIST_ID],

      updateEnabled: true,

      attributes: {

        STORE_URL: audit.store_url ?? "",

        AUDIT_ID: audit.id ?? "",

        OVERALL_SCORE: audit.overall_score ?? 0

      }

    }

    const contactResponse = await fetch(
      "https://api.brevo.com/v3/contacts",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        },

        body: JSON.stringify(contactPayload)
      }
    )

    console.log("Contact Status:", contactResponse.status)

    /**
     * STEP 2 — Send Email
     */

    const emailPayload = {

      sender: {
        email: "aryan@finzie.co",
        name: "Finzie"
      },

      to: [
        {
          email: audit.email
        }
      ],

      templateId: TEMPLATE_ID,

      params: {

        store_url: audit.store_url ?? "",

        overall_score: audit.overall_score ?? 0,

        audit_id: audit.id ?? "",

        critical_issues: audit.critical_issues ?? 0

      }

    }

    const emailResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "api-key": apiKey

        },

        body: JSON.stringify(emailPayload)

      }
    )

    console.log("Email Status:", emailResponse.status)

    const emailText = await emailResponse.text()

    console.log("Email Response:", emailText)

    if (!emailResponse.ok) {

      throw new Error(emailText)

    }

    console.log("✅ Email Sent Successfully")

    console.log("========== BREVO DEBUG END ==========")

    return true

  } catch (error: any) {

    console.error("❌ Brevo Error:", error.message)

    throw error

  }

}