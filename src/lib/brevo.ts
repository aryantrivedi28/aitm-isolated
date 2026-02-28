type AuditData = {
  id: string
  email: string
  store_url?: string
  overall_score?: number
  critical_issues?: any[]
}

const LIST_ID = 3

export async function addContactToBrevo(audit: AuditData) {
  try {
    const criticalCount = audit.critical_issues?.length ?? 0

    const response = await fetch(
      "https://api.brevo.com/v3/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!
        },
        body: JSON.stringify({
          email: audit.email,
          listIds: [LIST_ID],
          updateEnabled: true,
          attributes: {
            STORE_URL: audit.store_url ?? "",
            AUDIT_ID: audit.id ?? "",
            OVERALL_SCORE: audit.overall_score ?? 0,
            CRITICAL_ISSUES: criticalCount,
            PLAN_TYPE: "free"
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    const data = await response.json()

    console.log("✅ Contact added to Brevo:", data)

    return data

  } catch (error: any) {
    console.error("❌ Brevo Error:", error.message)
    throw error
  }
}