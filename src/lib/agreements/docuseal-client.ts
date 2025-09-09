interface DocuSealConfig {
      baseUrl: string
      apiKey: string
}

interface DocuSealTemplate {
      id: string
      name: string
      fields: DocuSealField[]
}

interface DocuSealField {
      name: string
      type: "text" | "signature" | "date" | "checkbox"
      required: boolean
      page: number
      x: number
      y: number
      width: number
      height: number
}

interface DocuSealSubmission {
      id: string
      template_id: string
      submitters: DocuSealSubmitter[]
      status: "pending" | "completed" | "expired"
      created_at: string
      completed_at?: string
      audit_trail_url?: string
      documents: DocuSealDocument[]
}

interface DocuSealSubmitter {
      email: string
      name: string
      role: string
      status: "pending" | "completed"
      signed_at?: string
      signature_url?: string
}

interface DocuSealDocument {
      id: string
      filename: string
      url: string
      content_type: string
}

export class DocuSealClient {
      private config: DocuSealConfig

      constructor(config: DocuSealConfig) {
            this.config = config
      }

      private async makeRequest(endpoint: string, options: RequestInit = {}) {
            const url = `${this.config.baseUrl}${endpoint}`

            const headers: HeadersInit = {
                  "X-Auth-Token": this.config.apiKey, // ✅ free edition uses X-Auth-Token
                  "Content-Type": "application/json",
                  ...options.headers,
            }

            const response = await fetch(url, {
                  ...options,
                  headers,
            })

            if (!response.ok) {
                  const error = await response.text()
                  throw new Error(`DocuSeal API Error: ${response.status} - ${error}`)
            }

            return response.json()
      }

      // async createTemplate(name: string, pdfBuffer: Buffer): Promise<DocuSealTemplate> {
      //       console.log("Creating template with name:", name);
      //       console.log("PDF buffer length:", pdfBuffer.length);
      //       console.log("PDF first few bytes:", pdfBuffer.subarray(0, 10).toString('hex'));

      //       const formData = new FormData();
      //       formData.append("name", name);

      //       const uint8Array = new Uint8Array(pdfBuffer);
      //       formData.append("file", new Blob([uint8Array], { type: "application/pdf" }), "document.pdf");

      //       const url = `${this.config.baseUrl}/templates`;


      //       console.log("Uploading to:", url);
      //       console.log("API Key length:", this.config.apiKey.length);
      //       console.log("FormData entries:");
      //       for (const [key, value] of formData.entries()) {
      //             console.log(`${key}:`, value instanceof Blob ? `Blob (${value.size} bytes)` : value);
      //       }
      //       const response = await fetch(url, {
      //             method: "POST",
      //             headers: {
      //                   Authorization: `Bearer ${this.config.apiKey}`,
      //             },
      //             body: formData,
      //       });

      //       // Read the response once and store it
      //       const responseText = await response.text();
      //       console.log("Raw response:", responseText);

      //       if (!response.ok) {
      //             console.error("Template creation failed. Status:", response.status);
      //             console.error("Response headers:", Object.fromEntries(response.headers.entries()));

      //             try {
      //                   const errorData = JSON.parse(responseText);
      //                   console.error("DocuSeal error details:", errorData);
      //                   throw new Error(`Failed to create template: ${response.status} - ${JSON.stringify(errorData)}`);
      //             } catch (e) {
      //                   console.error("Raw error response:", responseText);
      //                   throw new Error(`Failed to create template: ${response.status} - ${responseText}`);
      //             }
      //       }

      //       try {
      //             const json = JSON.parse(responseText);
      //             console.log("[DocuSealClient] Template created successfully:", json);
      //             return json;
      //       } catch (e) {
      //             throw new Error(`Invalid JSON response: ${responseText}`);
      //       }
      // }

      async getTemplates(): Promise<DocuSealTemplate[]> {
            console.log("[DocuSealClient] getTemplates called")
            const res = await this.makeRequest("/api/templates")
            console.log("[DocuSealClient] getTemplates response:", res)
            // API wraps templates inside "data"
            return Array.isArray(res) ? res : res.data
      }


      async createSubmission(
            templateId: string,
            submitters: Omit<DocuSealSubmitter, "status">[],
      ): Promise<DocuSealSubmission> {
            console.log("[DocuSealClient] createSubmission for template:", templateId)
            return this.makeRequest("/api/submissions", {
                  method: "POST",
                  body: JSON.stringify({
                        template_id: templateId,
                        submitters: submitters.map((s) => ({
                              ...s,
                              send_email: true,
                        })),
                  }),
            })
      }

      async getSubmission(submissionId: string): Promise<DocuSealSubmission> {
            console.log("[DocuSealClient] getSubmission:", submissionId)
            return this.makeRequest(`/api/submissions/${submissionId}`)
      }

      async getSubmissions(templateId?: string): Promise<DocuSealSubmission[]> {
            console.log("[DocuSealClient] getSubmissions with templateId:", templateId)
            const endpoint = templateId
                  ? `/api/submissions?template_id=${templateId}`
                  : "/api/submissions"
            return this.makeRequest(endpoint)
      }

      async resendEmail(submissionId: string, submitterEmail: string): Promise<void> {
            console.log("[DocuSealClient] resendEmail:", submissionId, submitterEmail)
            await this.makeRequest(`/api/submissions/${submissionId}/emails`, {
                  method: "POST",
                  body: JSON.stringify({ submitter_email: submitterEmail }),
            })
      }

      async archiveSubmission(submissionId: string): Promise<void> {
            console.log("[DocuSealClient] archiveSubmission:", submissionId)
            await this.makeRequest(`/api/submissions/${submissionId}`, { method: "DELETE" })
      }

      static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
            const crypto = require("crypto")
            const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
            const valid = `sha256=${expectedSignature}` === signature
            console.log("[DocuSealClient] verifyWebhookSignature:", valid)
            return valid
      }
}

export function createDocuSealClient(): DocuSealClient {
      const config: DocuSealConfig = {
            baseUrl: process.env.DOCUSEAL_URL || "",
            apiKey: process.env.DOCUSEAL_TOKEN || "",
      }

      console.log("[DocuSealClient] createDocuSealClient config:", config)

      if (!config.baseUrl || !config.apiKey) {
            throw new Error(
                  "DocuSeal configuration is missing. Please set DOCUSEAL_URL and DOCUSEAL_TOKEN environment variables."
            )
      }

      return new DocuSealClient(config)
}