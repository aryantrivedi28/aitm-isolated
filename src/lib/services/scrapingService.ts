import puppeteer, { type Browser } from "puppeteer"
import * as cheerio from "cheerio"
import mammoth from "mammoth"
import PDFParser from "pdf2json"
import axios from "axios"
import OpenAI from "openai"


// Configuration constants
const CONFIG = {
  MAX_PORTFOLIO_CHARS: 50000,
  SCRAPING_TIMEOUT: 15000,
  FETCH_TIMEOUT: 10000,
}

export class ScrapingService {
  private browser: Browser | null = null

  async initialize(): Promise<boolean> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ],
      })
      console.log("🚀 Browser initialized successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to initialize browser:", error)
      return false
    }
  }

  private analyzeUrlOnly(url: string): string {
    if (!url) return "No portfolio URL provided"

    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname
      const path = urlObj.pathname

      const platformAnalysis = this.analyzePlatform(domain)
      return `Portfolio URL provided: ${url}. Platform: ${platformAnalysis}. Path analysis: ${path}`
    } catch (error) {
      return `Invalid portfolio URL provided: ${url}`
    }
  }

  private analyzePlatform(domain: string): string {
    const platforms = {
      "github.com": "GitHub - Code repository and projects",
      "gitlab.com": "GitLab - Code repository and CI/CD",
      "bitbucket.org": "Bitbucket - Code repository",
      "linkedin.com": "LinkedIn - Professional profile",
      "behance.net": "Behance - Creative portfolio",
      "dribbble.com": "Dribbble - Design portfolio",
      "dev.to": "Dev.to - Developer blog",
      "medium.com": "Medium - Technical blog",
      "stackoverflow.com": "Stack Overflow - Developer profile",
    }

    for (const [key, value] of Object.entries(platforms)) {
      if (domain.includes(key)) {
        return value
      }
    }

    return "Custom portfolio website"
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch (err) {
      return false
    }
  }

  private extractFileId(url: string): string {
    console.log(`🔍 Extracting file ID from: ${url}`)

    // Handle different Google Drive URL formats
    let fileId = ""

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    let match = url.match(/\/file\/d\/(.*?)\/view/)
    if (match && match[1]) {
      fileId = match[1]
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
      match = url.match(/[?&]id=([^&]+)/)
      if (match && match[1]) {
        fileId = match[1]
      }
    }

    // Format 3: https://drive.google.com/file/d/FILE_ID/edit
    if (!fileId) {
      match = url.match(/\/file\/d\/(.*?)\/edit/)
      if (match && match[1]) {
        fileId = match[1]
      }
    }

    // Format 4: https://docs.google.com/document/d/FILE_ID/
    if (!fileId) {
      match = url.match(/\/document\/d\/(.*?)\//)
      if (match && match[1]) {
        fileId = match[1]
      }
    }

    // Format 5: Direct file ID (if someone just pastes the ID)
    if (!fileId && url.length > 10 && url.length < 50 && !url.includes("/")) {
      fileId = url
    }

    console.log(`📋 Extracted file ID: ${fileId || "Not found"}`)
    return fileId
  }

  async parseResume(fileUrl: string | undefined): Promise<string> {
    if (!fileUrl || fileUrl.trim().length === 0) {
      console.warn("⚠️ Invalid or missing resume file URL")
      return "No resume available"
    }

    console.log(`📄 Starting resume parsing for: ${fileUrl}`)

    // Try multiple methods to access the file
    const methods = [
      () => this.trySupabaseFileParsing(fileUrl), // ✅ Add this line
      () => this.tryPdf2JsonParsing(fileUrl),
      () => this.tryGoogleDocsExport(fileUrl),
      () => this.tryPuppeteerScraping(fileUrl),
      () => this.tryDirectDownload(fileUrl),
      () => this.tryAlternativeFormats(fileUrl),
    ]


    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔄 Method ${i + 1}: Attempting to parse resume...`)
        const result = await methods[i]()

        if (result && result.length > 50 && !result.includes("not accessible") && this.isReadableText(result)) {
          console.log(`✅ Method ${i + 1} successful: ${result.length} characters`)
          return result
        } else {
          console.log(`⚠️ Method ${i + 1} returned insufficient or unreadable content`)
        }
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error instanceof Error ? error.message : "Unknown error")
        continue
      }
    }

    // If all methods failed, provide specific guidance
    const fileId = this.extractFileId(fileUrl)
    if (fileId) {
      const accessCheck = await this.checkFileAccess(fileId)
      return `Resume parsing failed - ${accessCheck.message}

To fix this issue:
1. Open the Google Drive file
2. Click "Share" button
3. Change access to "Anyone with the link can view"
4. Copy the new shareable link
5. Update your form submission with the new link

Current file ID: ${fileId}`
    } else {
      return `Resume parsing failed - Invalid Google Drive URL format. Please provide a valid Google Drive sharing link.`
    }
  }


  //supabase file parsing
  private async trySupabaseFileParsing(fileUrl: string): Promise<string> {
    if (!fileUrl.includes("supabase.co") && !fileUrl.includes("storage.googleapis.com")) {
      throw new Error("Not a Supabase file URL")
    }

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" })
    const buffer = Buffer.from(response.data)

    // Try PDF first
    const pdfHeader = buffer.toString("hex", 0, 4)
    if (pdfHeader === "25504446") {
      console.log("📄 Detected PDF format, parsing with pdf2json...")
      return await this.extractTextWithPdf2Json(buffer)
    }

    try {
      console.log("📄 Attempting DOCX parsing with mammoth...")
      const result = await mammoth.extractRawText({ buffer })
      if (result && result.value.trim().length > 0) {
        console.log("✅ DOCX parsing successful")
        return result.value
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.log("❌ DOCX parsing failed", msg)
    }


    throw new Error("Unsupported file format or empty file")
  }


  private tryPdf2JsonParsing = (fileUrl: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileId = this.extractFileId(fileUrl)
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

        const response = await axios.get(downloadUrl, {
          responseType: "arraybuffer",
          timeout: 10000, // Added timeout to prevent hanging
        })

        const buffer = Buffer.from(response.data)

        if (!buffer || buffer.length === 0) {
          throw new Error("Empty or invalid PDF buffer")
        }

        const pdfHeader = buffer.toString("hex", 0, 4)
        if (pdfHeader !== "25504446") {
          // %PDF in hex
          throw new Error("File is not a valid PDF")
        }

        const pdfParser = new PDFParser()

        const parseTimeout = setTimeout(() => {
          reject(new Error("PDF parsing timeout - file may be corrupted"))
        }, 15000)

        pdfParser.on("pdfParser_dataError", (errData) => {
          clearTimeout(parseTimeout)
          console.error("PDF parsing error:", errData.parserError)
          reject(new Error(`PDF parsing failed: ${errData.parserError}`))
        })

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          clearTimeout(parseTimeout)
          try {
            const texts: string[] = []

            if (!pdfData || !pdfData.FormImage || !pdfData.FormImage.Pages) {
              throw new Error("Invalid PDF data structure")
            }

            const pages = pdfData.FormImage.Pages
            pages.forEach((page: any) => {
              if (page && page.Texts && Array.isArray(page.Texts)) {
                page.Texts.forEach((textItem: any) => {
                  if (textItem && textItem.R && Array.isArray(textItem.R)) {
                    const rawText = textItem.R.map((r: any) => {
                      try {
                        return decodeURIComponent(r.T || "")
                      } catch (e) {
                        return r.T || ""
                      }
                    }).join(" ")
                    if (rawText.trim()) {
                      texts.push(rawText)
                    }
                  }
                })
              }
            })

            const fullText = texts.join(" ").replace(/\s+/g, " ").trim()

            if (fullText.length < 10) {
              throw new Error("No readable text extracted from PDF")
            }

            resolve(fullText)
          } catch (error) {
            reject(new Error(`Error processing PDF data: ${error instanceof Error ? error.message : "Unknown error"}`))
          }
        })

        try {
          pdfParser.parseBuffer(buffer)
        } catch (error) {
          clearTimeout(parseTimeout)
          reject(new Error(`Failed to start PDF parsing: ${error instanceof Error ? error.message : "Unknown error"}`))
        }
      } catch (error) {
        reject(new Error(`PDF download failed: ${error instanceof Error ? error.message : "Unknown error"}`))
      }
    })
  }

  private async extractTextWithPdf2Json(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("🔍 Using pdf2json for PDF parsing...")

      if (!buffer || buffer.length === 0) {
        reject(new Error("Empty or invalid PDF buffer"))
        return
      }

      const pdfHeader = buffer.toString("hex", 0, 4)
      if (pdfHeader !== "25504446") {
        // %PDF in hex
        reject(new Error("File is not a valid PDF"))
        return
      }

      const pdfParser = new PDFParser()

      const parseTimeout = setTimeout(() => {
        reject(new Error("PDF parsing timeout - file may be corrupted or too large"))
      }, 20000)

      // Set up event handlers
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        clearTimeout(parseTimeout)
        console.error("❌ pdf2json parsing error:", errData.parserError)
        reject(new Error(`PDF parsing failed: ${errData.parserError}`))
      })

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        clearTimeout(parseTimeout)
        try {
          console.log("✅ pdf2json parsing successful")

          // Extract text from the parsed PDF data
          const extractedText = this.extractTextFromPdfData(pdfData)

          if (extractedText && extractedText.length > 50) {
            console.log(`📄 Extracted ${extractedText.length} characters from PDF`)
            resolve(this.cleanExtractedText(extractedText))
          } else {
            reject(new Error("No readable text found in PDF"))
          }
        } catch (error) {
          console.error("❌ Error processing PDF data:", error)
          reject(error)
        }
      })

      // Parse the PDF buffer
      try {
        pdfParser.parseBuffer(buffer)
      } catch (error) {
        clearTimeout(parseTimeout)
        console.error("❌ Error starting PDF parsing:", error)
        reject(
          new Error(`Failed to initialize PDF parser: ${error instanceof Error ? error.message : "Unknown error"}`),
        )
      }
    })
  }

  private extractTextFromPdfData(pdfData: any): string {
    const textParts: string[] = []

    try {
      if (!pdfData) {
        throw new Error("PDF data is null or undefined")
      }

      if (!pdfData.Pages || !Array.isArray(pdfData.Pages)) {
        throw new Error("PDF data does not contain valid pages array")
      }

      console.log(`📄 Processing ${pdfData.Pages.length} pages`)

      pdfData.Pages.forEach((page: any, pageIndex: number) => {
        console.log(`📄 Processing page ${pageIndex + 1}`)

        if (!page || !page.Texts || !Array.isArray(page.Texts)) {
          console.warn(`⚠️ Page ${pageIndex + 1} has no valid text data`)
          return
        }

        page.Texts.forEach((textItem: any) => {
          if (!textItem || !textItem.R || !Array.isArray(textItem.R)) {
            return
          }

          textItem.R.forEach((textRun: any) => {
            if (textRun && textRun.T) {
              try {
                // Decode the text (pdf2json uses URI encoding)
                const decodedText = decodeURIComponent(textRun.T)
                if (decodedText && decodedText.trim().length > 0) {
                  textParts.push(decodedText)
                }
              } catch (decodeError) {
                // If decoding fails, use raw text
                if (textRun.T && textRun.T.trim().length > 0) {
                  textParts.push(textRun.T)
                }
              }
            }
          })
        })
      })

      const fullText = textParts.join(" ")
      console.log(`📊 Extracted text parts: ${textParts.length}, Total length: ${fullText.length}`)

      return fullText
    } catch (error) {
      console.error("❌ Error extracting text from PDF data:", error)
      throw error
    }
  }


  private async extractStructuredResumeData(rawText: string) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })

    console.log("🧠 Sending resume text to OpenAI for structured parsing...")

    const prompt = `
You are a professional resume parser. Extract structured JSON fields from the following resume text.

Resume text:
"""
${rawText.slice(0, 10000)}  // limit to avoid tokens overflow
"""

Return a JSON with these keys:
{
  "name": string,
  "email": string,
  "phone": string,
  "title": string,
  "skills": string[],
  "education": string[],
  "experience": [
    { "title": string, "company": string, "years": string, "details": string }
  ],
  "projects": string[],
  "certifications": string[]
}
Only return JSON, no explanation.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    })

    try {
      const parsed = JSON.parse(response.choices[0].message?.content || "{}")
      console.log("✅ Parsed structured data:", parsed)
      return parsed
    } catch (error) {
      console.error("❌ Failed to parse structured resume data:", error)
      return { error: "Failed to parse structured data" }
    }
  }


  private async tryGoogleDocsExport(fileUrl: string): Promise<string> {
    const fileId = this.extractFileId(fileUrl)
    if (!fileId) {
      throw new Error("Could not extract file ID")
    }

    console.log(`📄 Trying Google Docs export for file ID: ${fileId}`)

    // Try multiple export formats in order of preference
    const exportUrls = [
      `https://docs.google.com/document/d/${fileId}/export?format=txt`,
      `https://docs.google.com/document/d/${fileId}/export?format=docx`,
      `https://docs.google.com/document/d/${fileId}/export?format=odt`,
      `https://docs.google.com/document/d/${fileId}/export?format=rtf`,
      // Try as spreadsheet if it's not a doc
      `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv`,
      `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`,
    ]

    for (const exportUrl of exportUrls) {
      try {
        console.log(`🔄 Trying export URL: ${exportUrl}`)

        const response = await fetch(exportUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          redirect: "follow",
        })

        if (response.ok) {
          const contentType = response.headers.get("content-type") || ""
          console.log(`📋 Export content type: ${contentType}`)

          if (contentType.includes("text/plain") || contentType.includes("text/csv")) {
            const text = await response.text()
            if (text && text.length > 50 && this.isReadableText(text) && !this.isDriveInterfaceText(text)) {
              console.log(`✅ Text export successful: ${text.length} characters`)
              return this.cleanExtractedText(text)
            }
          } else if (contentType.includes("officedocument") || contentType.includes("wordprocessingml")) {
            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const docxText = await this.extractTextFromDocx(buffer)
            if (docxText && docxText.length > 50 && !this.isDriveInterfaceText(docxText)) {
              return docxText
            }
          }
        } else {
          console.log(`❌ Export failed with status: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ Export URL failed: ${error}`)
        continue
      }
    }

    throw new Error("All export formats failed")
  }

  private async tryPuppeteerScraping(fileUrl: string): Promise<string> {
    if (!this.browser) {
      throw new Error("Browser not available")
    }

    const fileId = this.extractFileId(fileUrl)
    if (!fileId) {
      throw new Error("Could not extract file ID")
    }

    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
    console.log(`🌐 Trying Puppeteer scraping: ${viewUrl}`)

    const page = await this.browser.newPage()

    try {
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
      await page.goto(viewUrl, {
        waitUntil: "domcontentloaded",
        timeout: CONFIG.SCRAPING_TIMEOUT,
      })

      // Wait for content to load
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Check for access denied or login required
      const accessDenied = await page.$(".ndfHFb-c4YZDc-GSWXbd")
      const loginRequired = await page.$('input[type="email"]')

      if (accessDenied || loginRequired) {
        throw new Error("File is not publicly accessible - requires login or permission")
      }

      // Try to find and click any "Open" buttons (without :has-text)
      const buttons = await page.$$('div[role="button"]')
      for (const button of buttons) {
        const text = await button.evaluate((el) => el.textContent?.toLowerCase())
        if (text && text.includes("open")) {
          console.log("🔄 Clicking Open button...")
          await button.click()
          await new Promise((resolve) => setTimeout(resolve, 3000))
          break
        }
      }

      // Try multiple selectors for different Google Drive preview types
      const content = await page.evaluate(() => {
        // First, check if we're seeing the Drive interface instead of content
        const driveInterface = document.querySelector(
          ".ndfHFb-c4YZDc-GSWXbd, .a-s-fa-Ha-pa, .ndfHFb-c4YZDc-to915-LgbsSe-haAclf",
        )
        if (driveInterface && document.body.innerText.includes("Open with")) {
          return "DRIVE_INTERFACE_DETECTED"
        }

        const selectors = [
          // Google Docs preview (most common)
          ".kix-page-content-wrap .kix-page",
          ".kix-page-content",
          ".kix-page",
          ".doc-content",
          '[role="textbox"]',

          // PDF preview selectors
          ".ndfHFb-c4YZDc-Wrql6b .ndfHFb-c4YZDc-to915-LgbsSe",
          ".ndfHFb-c4YZDc-Wrql6b",
          ".ndfHFb-c4YZDc-to915-LgbsSe",

          // Text content selectors
          "pre",
          "code",
          ".text-content",

          // Fallback selectors
          'div[style*="font-family"]',
          'span[style*="font-family"]',
          "div[data-kix-lineview]",
          ".kix-lineview-text-block",
        ]

        let extractedText = ""

        for (const selector of selectors) {
          try {
            const elements = document.querySelectorAll(selector)
            console.log(`Trying selector: ${selector}, found ${elements.length} elements`)

            elements.forEach((el) => {
              const text = el.textContent?.trim()
              if (text && text.length > 10 && !text.includes("Open with") && !text.includes("Sign in")) {
                extractedText += text + " "
              }
            })

            // If we found substantial content, break
            if (extractedText.length > 200) {
              console.log(`Found content with selector: ${selector}`)
              break
            }
          } catch (e) {
            console.log(`Error with selector ${selector}:`, e)
          }
        }

        return extractedText.trim()
      })

      // Handle different response types
      if (content === "DRIVE_INTERFACE_DETECTED") {
        throw new Error("File is not publicly accessible - seeing Google Drive interface instead of content")
      }

      if (content && content.length > 50 && this.isReadableText(content) && !this.isDriveInterfaceText(content)) {
        return this.cleanExtractedText(content)
      }

      throw new Error("No readable content found in preview")
    } finally {
      await page.close()
    }
  }

  // Add helper method to detect Drive interface text
  private isDriveInterfaceText(text: string): boolean {
    const driveInterfaceKeywords = [
      "Open with",
      "Sign in",
      "Save changes",
      "Google Drive",
      "Open",
      "Download",
      "Share",
      "Get link",
      "Make a copy",
    ]

    const lowerText = text.toLowerCase()
    const keywordCount = driveInterfaceKeywords.filter((keyword) => lowerText.includes(keyword.toLowerCase())).length

    // If more than 2 interface keywords and text is short, it's likely interface text
    return keywordCount >= 2 && text.length < 200
  }

  private isReadableText(text: string): boolean {
    if (!text || text.length < 20) return false

    // Check for meaningful content patterns
    const hasLetters = /[a-zA-Z]/.test(text)
    const hasWords = text.split(/\s+/).length > 5
    const notJustSymbols = !/^[^a-zA-Z0-9\s]*$/.test(text)

    // Check if it's not just interface text
    const notInterfaceText = !this.isDriveInterfaceText(text)

    return hasLetters && hasWords && notJustSymbols && notInterfaceText
  }

  private async checkFileAccess(fileId: string): Promise<{ accessible: boolean; message: string }> {
    try {
      // Try a simple HEAD request to check if file is accessible
      const testUrl = `https://drive.google.com/file/d/${fileId}/view`
      const response = await fetch(testUrl, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (response.ok) {
        return {
          accessible: true,
          message: "File appears to be accessible",
        }
      } else {
        return {
          accessible: false,
          message: `File access check failed with status ${response.status}. File may not be publicly shared.`,
        }
      }
    } catch (error) {
      return {
        accessible: false,
        message: "Unable to check file accessibility",
      }
    }
  }

  private async tryDirectDownload(fileUrl: string): Promise<string> {
    const fileId = this.extractFileId(fileUrl)
    if (!fileId) {
      throw new Error("Could not extract file ID")
    }

    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    console.log(`Trying direct download: ${directUrl}`)

    const response = await fetch(directUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "follow",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type") || ""
    console.log(`Direct download content type: ${contentType}`)

    if (contentType.includes("text/html")) {
      throw new Error("Received HTML instead of file - file may not be publicly accessible")
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return await this.processFileBuffer(buffer, contentType, fileUrl)
  }

  private async tryAlternativeFormats(fileUrl: string): Promise<string> {
    const fileId = this.extractFileId(fileUrl)
    if (!fileId) {
      throw new Error("Could not extract file ID")
    }

    const alternativeUrls = [
      `https://drive.google.com/uc?id=${fileId}&export=download`,
      `https://drive.google.com/file/d/${fileId}/view`,
      `https://docs.google.com/document/d/${fileId}/edit`,
    ]

    for (const altUrl of alternativeUrls) {
      try {
        console.log(`Trying alternative URL: ${altUrl}`)

        const response = await fetch(altUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        })

        if (response.ok) {
          const contentType = response.headers.get("content-type") || ""

          if (!contentType.includes("text/html")) {
            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            return await this.processFileBuffer(buffer, contentType, altUrl)
          }
        }
      } catch (error) {
        console.log(`Alternative URL failed: ${error}`)
        continue
      }
    }

    throw new Error("All alternative formats failed")
  }

  private async processFileBuffer(buffer: Buffer, contentType: string, originalUrl: string): Promise<string> {
    const isPdf = originalUrl.toLowerCase().includes(".pdf") || contentType.includes("pdf")
    const isDocx =
      originalUrl.toLowerCase().includes(".docx") ||
      contentType.includes("officedocument") ||
      contentType.includes("wordprocessingml")
    const isDoc = originalUrl.toLowerCase().includes(".doc") || contentType.includes("msword")

    console.log(`🔍 File type detection: PDF=${isPdf}, DOCX=${isDocx}, DOC=${isDoc}`)

    if (isPdf) {
      // Use pdf2json for PDF files
      return await this.extractTextWithPdf2Json(buffer)
    } else if (isDocx || isDoc) {
      // Try DOCX first as it's more reliable
      return await this.extractTextFromDocx(buffer)
    } else {
      console.warn("⚠️ Unsupported file format:", contentType)

      // Try to detect file type by content
      const fileHeader = buffer.toString("hex", 0, 8).toLowerCase()
      console.log(`🔍 File header: ${fileHeader}`)

      if (fileHeader.startsWith("25504446")) {
        // PDF magic number
        console.log("🔍 Detected PDF by file header")
        return await this.extractTextWithPdf2Json(buffer)
      } else if (fileHeader.startsWith("504b0304")) {
        // ZIP/DOCX magic number - try DOCX first
        console.log("🔍 Detected DOCX by file header")
        return await this.extractTextFromDocx(buffer)
      } else if (fileHeader.startsWith("d0cf11e0")) {
        // DOC magic number
        console.log("🔍 Detected DOC by file header")
        return await this.extractTextFromDocx(buffer)
      }

      return `Unsupported file format: ${contentType}. Supported formats: PDF, DOC, DOCX`
    }
  }

  private async extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
      console.log("🔍 Attempting to parse DOCX/DOC...")
      const result = await mammoth.extractRawText({ buffer })
      const text = this.cleanExtractedText(result.value || "")
      console.log(`✅ DOCX/DOC parsed successfully: ${text.length} characters`)
      return text
    } catch (err) {
      console.error("❌ DOCX parsing error:", err)
      return `DOCX parsing failed: ${err instanceof Error ? err.message : "Unknown error"}`
    }
  }

  private cleanExtractedText(text: string): string {
    return text
      .replace(/\s+/g, " ") // Replace multiple whitespace with single space
      .replace(/[^\w\s\-@.(),!?]/g, " ") // Keep more punctuation for readability
      .replace(/\s+/g, " ") // Clean up again after character replacement
      .trim()
  }

  async readProposal(proposalText: string | undefined): Promise<string> {
    if (!proposalText || proposalText.trim().length < 10) {
      console.warn("⚠️ Proposal text is empty or too short")
      return "No meaningful proposal content"
    }

    const cleaned = this.cleanExtractedText(proposalText)

    if (cleaned.length < 10) {
      return "Proposal content too short after cleaning"
    }

    return cleaned
  }


  async parsePortfolio(url: string): Promise<string> {
    if (!this.browser) throw new Error("Browser not initialized")

    const page = await this.browser.newPage()

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
      const content = await page.evaluate(() => {
        const bodyText = document.body?.innerText || ""
        return bodyText.trim()
      })
      return content
    } catch (err) {
      console.error("❌ Error scraping portfolio:", err)
      throw err
    } finally {
      await page.close()
    }
  }

  async scrapePortfolio(url: string | undefined): Promise<string> {
    if (!url || !this.isValidUrl(url)) {
      console.log("⚠️ Invalid or missing portfolio URL")
      return "No portfolio URL provided"
    }

    if (!this.browser) {
      console.log("⚠️ Browser not initialized, analyzing URL only")
      return this.analyzeUrlOnly(url)
    }

    const attempts = [
      () => this.scrapeWithPuppeteer(url),
      () => this.scrapeWithFetch(url),
      () => this.analyzeUrlOnly(url),
    ]

    for (let i = 0; i < attempts.length; i++) {
      try {
        console.log(`🌐 Attempt ${i + 1}: Scraping portfolio: ${url}`)
        const result = await attempts[i]()

        if (result && result.length > 20) {
          console.log(`✅ Portfolio scraped successfully: ${result.length} characters`)
          return this.enhancePortfolioContent(result, url)
        }
      } catch (error) {
        console.error(`❌ Attempt ${i + 1} failed:`, error)
        continue
      }
    }

    return this.analyzeUrlOnly(url)
  }

  private async scrapeWithPuppeteer(url: string): Promise<string> {
    if (!this.browser) throw new Error("Browser not available")

    const page = await this.browser.newPage()

    try {
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
      await page.setViewport({ width: 1280, height: 720 })

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: CONFIG.SCRAPING_TIMEOUT,
      })

      // Wait for dynamic content but with shorter timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const content = await page.evaluate(() => {
        const sections: string[] = []

        const selectors = [
          "h1, h2, h3, h4, h5, h6",
          '[class*="about"], [id*="about"]',
          '[class*="skill"], [id*="skill"]',
          '[class*="project"], [id*="project"]',
          '[class*="experience"], [id*="experience"]',
          '[class*="work"], [id*="work"]',
          "main p",
          "article p",
          ".content p",
          "li",
        ]

        selectors.forEach((selector) => {
          try {
            const elements = document.querySelectorAll(selector)
            elements.forEach((el) => {
              const text = el.textContent?.trim()
              if (text && text.length > 10 && text.length < 500) {
                sections.push(text)
              }
            })
          } catch (e) {
            // Skip problematic selectors
          }
        })

        return sections.join(" ")
      })

      let text = content.replace(/\s+/g, " ").trim()

      if (text.length > CONFIG.MAX_PORTFOLIO_CHARS) {
        text = text.substring(0, CONFIG.MAX_PORTFOLIO_CHARS) + "..."
      }

      return text || "Portfolio loaded but no readable content found"
    } finally {
      await page.close()
    }
  }

  private async scrapeWithFetch(url: string): Promise<string> {
    console.log("🔄 Trying fetch method...")

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
        signal: AbortSignal.timeout(CONFIG.FETCH_TIMEOUT),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      $("script, style, nav, footer, header, .nav, .footer, .header").remove()

      const sections: string[] = []

      $("h1, h2, h3, h4, h5, h6").each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length < 200) {
          sections.push(`HEADING: ${text}`)
        }
      })

      $("p").each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 20 && text.length < 500) {
          sections.push(text)
        }
      })

      $("li").each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 10 && text.length < 300) {
          sections.push(`• ${text}`)
        }
      })

      let text = sections.join(" ")
      text = text.replace(/\s+/g, " ").trim()

      if (text.length > CONFIG.MAX_PORTFOLIO_CHARS) {
        text = text.substring(0, CONFIG.MAX_PORTFOLIO_CHARS) + "..."
      }

      return text || "Portfolio fetched but no readable content found"
    } catch (error) {
      throw new Error(`Fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private enhancePortfolioContent(content: string, url: string): string {
    const enhanced = `Portfolio from ${url}: ${content}`

    const techKeywords = [
      "devops",
      "ci/cd",
      "jenkins",
      "gitlab ci",
      "github actions",
      "azure devops",
      "aws",
      "azure",
      "gcp",
      "google cloud",
      "cloud architecture",
      "docker",
      "kubernetes",
      "helm",
      "containerization",
      "terraform",
      "cloudformation",
      "ansible",
      "pulumi",
      "prometheus",
      "grafana",
      "elk",
      "datadog",
      "monitoring",
      "observability",
      "security",
      "devsecops",
      "vulnerability",
      "compliance",
      "python",
      "javascript",
      "typescript",
      "java",
      "go",
      "bash",
      "shell",
      "mongodb",
      "postgresql",
      "mysql",
      "redis",
      "react",
      "node",
      "api",
      "rest",
      "graphql",
      "agile",
      "scrum",
      "kanban",
      "sre",
    ]

    const lowerContent = enhanced.toLowerCase()
    const foundKeywords = techKeywords.filter((keyword) => lowerContent.includes(keyword.toLowerCase()))

    if (foundKeywords.length > 0) {
      return `${enhanced}\n\nTechnical keywords found: ${foundKeywords.join(", ")}`
    }

    return enhanced
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      console.log("🛑 Browser closed successfully")
    }
  }
}
