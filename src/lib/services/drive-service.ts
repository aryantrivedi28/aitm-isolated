import { google } from "googleapis"

export class DriveService {
  private auth: any

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly", "https://www.googleapis.com/auth/documents.readonly"],
    })
  }

  async extractContent(url: string): Promise<string> {
    try {
      const fileId = this.extractFileId(url)
      if (!fileId) return ""

      // Determine file type and extract accordingly
      if (url.includes("docs.google.com/document")) {
        return await this.extractDocumentContent(fileId)
      } else if (url.includes("drive.google.com")) {
        return await this.extractDriveFileContent(fileId)
      }

      return ""
    } catch (error) {
      console.error("Drive content extraction error:", error)
      return ""
    }
  }

  private extractFileId(url: string): string | null {
    // Extract file ID from various Google Drive URL formats
    const patterns = [/\/d\/([a-zA-Z0-9-_]+)/, /id=([a-zA-Z0-9-_]+)/, /file\/d\/([a-zA-Z0-9-_]+)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  private async extractDocumentContent(fileId: string): Promise<string> {
    try {
      const docs = google.docs({ version: "v1", auth: this.auth })
      const response = await docs.documents.get({ documentId: fileId })

      let content = ""
      const elements = response.data.body?.content || []

      for (const element of elements) {
        if (element.paragraph) {
          const paragraph = element.paragraph
          if (paragraph.elements) {
            for (const elem of paragraph.elements) {
              if (elem.textRun) {
                content += elem.textRun.content || ""
              }
            }
          }
        }
      }

      return content.trim()
    } catch (error) {
      console.error("Document extraction error:", error)
      return ""
    }
  }

  private async extractDriveFileContent(fileId: string): Promise<string> {
    try {
      const drive = google.drive({ version: "v3", auth: this.auth })

      // Get file metadata
      const fileMetadata = await drive.files.get({ fileId })
      const mimeType = fileMetadata.data.mimeType

      // Handle different file types
      if (mimeType?.includes("document")) {
        return await this.extractDocumentContent(fileId)
      } else if (mimeType?.includes("text") || mimeType?.includes("pdf")) {
        // Export as plain text
        const response = await drive.files.export({
          fileId,
          mimeType: "text/plain",
        })
        return response.data as string
      }

      return `File: ${fileMetadata.data.name} (${mimeType})`
    } catch (error) {
      console.error("Drive file extraction error:", error)
      return ""
    }
  }
}
