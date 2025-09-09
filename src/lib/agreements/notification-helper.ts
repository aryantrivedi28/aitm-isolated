interface NotificationData {
  recipientEmail: string
  recipientName: string
  documentType: string
  projectTitle: string
  [key: string]: any
}

export class NotificationHelper {
  static async sendDocumentCreatedNotification(
    data: NotificationData & {
      createdBy: string
    },
  ) {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "document_created",
          data,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to send document created notification")
      }
    } catch (error) {
      console.error("[v0] Error sending document created notification:", error)
    }
  }

  static async sendSignatureRequestNotification(
    data: NotificationData & {
      signatureUrl: string
      senderName: string
    },
  ) {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "signature_request",
          data,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to send signature request notification")
      }
    } catch (error) {
      console.error("[v0] Error sending signature request notification:", error)
    }
  }

  static async sendDocumentSignedNotification(
    data: NotificationData & {
      signerName: string
      signedDocumentUrl?: string
    },
  ) {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "document_signed",
          data,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to send document signed notification")
      }
    } catch (error) {
      console.error("[v0] Error sending document signed notification:", error)
    }
  }

  static async sendSignatureReminderNotification(
    data: NotificationData & {
      signatureUrl: string
      daysPending: number
      senderName: string
    },
  ) {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "signature_reminder",
          data,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to send signature reminder notification")
      }
    } catch (error) {
      console.error("[v0] Error sending signature reminder notification:", error)
    }
  }
}
