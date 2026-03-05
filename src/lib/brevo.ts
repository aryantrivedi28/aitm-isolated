type AuditData = {
  id: string
  email: string
  store_url?: string
  overall_score?: number
  critical_issues?: number
  top_issue_1?: string
  top_issue_2?: string
  top_issue_3?: string
}

const LIST_ID = 3
const TEMPLATE_ID = 3

export async function addContactToBrevo(audit: AuditData) {

  try {

    console.log("========== BREVO DEBUG START ==========")

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
        OVERALL_SCORE: audit.overall_score ?? 0,
        CRITICAL_ISSUES: audit.critical_issues ?? 0
      }
    }

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(contactPayload)
    })

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
        critical_issues: audit.critical_issues ?? 0,

        top_issue_1: audit.top_issue_1 ?? "",
        top_issue_2: audit.top_issue_2 ?? "",
        top_issue_3: audit.top_issue_3 ?? ""
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

    if (!emailResponse.ok) {
      const text = await emailResponse.text()
      throw new Error(text)
    }

    console.log("✅ Email Sent Successfully")

    return true

  } catch (error: any) {

    console.error("❌ Brevo Error:", error.message)

    throw error
  }
}