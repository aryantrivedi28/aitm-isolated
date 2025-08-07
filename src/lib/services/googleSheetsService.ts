import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { CONFIG } from "../config"

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet
  private serviceAccountAuth: JWT

  constructor(sheetId: string) {
    this.serviceAccountAuth = new JWT({
      email: CONFIG.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: CONFIG.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    this.doc = new GoogleSpreadsheet(sheetId, this.serviceAccountAuth)
  }

  async initialize(): Promise<boolean> {
    try {
      await this.doc.loadInfo()
      console.log(`✅ Connected to sheet: ${this.doc.title}`)
      return true
    } catch (error) {
      console.error("❌ Failed to initialize Google Sheets:", error)
      return false
    }
  }

  async getMainSheet() {
    if (!this.doc) throw new Error("Google Sheets not initialized")

    try {
      const sheet = this.doc.sheetsByIndex[0]
      console.log(`📄 Using sheet: ${sheet.title}`)
      return sheet
    } catch (error) {
      console.error("❌ Error getting main sheet:", error)
      return null
    }
  }

  async getUnprocessedRows() {
    try {
      const sheet = await this.getMainSheet()
      if (!sheet) return []

      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()

      const ratingColumnName = sheet.headerValues.find(h =>
        h?.toLowerCase().includes("rating")
      )

      const unprocessedRows = rows.filter((row, index) => {
        const ratingValue = ratingColumnName ? row.get(ratingColumnName) : ""
        const isUnprocessed = !ratingValue || ratingValue.toString().trim() === ""
        console.log(
          `${isUnprocessed ? "📝 Needs processing" : "✅ Already processed"} — Row ${index + 2
          }: ${row.get("Name") || "Unnamed"}`
        )
        return isUnprocessed
      })

      return unprocessedRows
    } catch (error) {
      console.error("❌ Error loading unprocessed rows:", error)
      return []
    }
  }

async updateRowWithRating(rowIndex: number, rating: number, review: string): Promise<boolean> {
  try {
    const sheet = await this.getMainSheet()
    if (!sheet) return false

    await sheet.loadHeaderRow()
    const rows = await sheet.getRows()
    const dataRowIndex = rowIndex - 2

    if (dataRowIndex < 0 || dataRowIndex >= rows.length) {
      console.error(`❌ Invalid row index: ${rowIndex}`)
      return false
    }

    const row = rows[dataRowIndex]

    const ratingColumn = sheet.headerValues.find(h =>
      h?.toLowerCase().includes("rating")
    )

    const reviewColumn = sheet.headerValues.find(h =>
      h?.toLowerCase().includes("review")
    )

    if (!ratingColumn || !reviewColumn) {
      console.error("❌ Missing 'Rating' or 'Review' columns in the sheet.")
      return false
    }

    row.set(ratingColumn, rating)
    row.set(reviewColumn, review)

    await row.save()

    console.log(`✅ Row ${rowIndex} updated — Rating: ${rating}, Review: ${review}`)
    return true
  } catch (error) {
    console.error("❌ Error updating row:", error)
    return false
  }
}



  async getSheetInfo() {
    try {
      await this.initialize()
      const sheet = await this.getMainSheet()
      if (!sheet) return null

      await sheet.loadHeaderRow()

      return {
        spreadsheetTitle: this.doc.title,
        sheetTitle: sheet.title,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount,
        headerRow: sheet.headerValues,
      }
    } catch (error) {
      console.error("❌ Error getting sheet info:", error)
      return null
    }
  }
}
