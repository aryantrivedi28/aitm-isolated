import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { CONFIG } from "../config"

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet | null = null
  private serviceAccountAuth: JWT

  constructor() {
    this.serviceAccountAuth = new JWT({
      email: CONFIG.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: CONFIG.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
  }

  async initialize(): Promise<boolean> {
    try {
      this.doc = new GoogleSpreadsheet(CONFIG.SPREADSHEET_ID, this.serviceAccountAuth)
      await this.doc.loadInfo()
      console.log(`Connected to sheet: ${this.doc.title}`)
      return true
    } catch (error) {
      console.error("Failed to initialize Google Sheets:", error)
      return false
    }
  }

  async getMainSheet() {
    if (!this.doc) throw new Error("Google Sheets not initialized")

    try {
      // Get the first sheet (usually "Form Responses 1")
      const sheet = this.doc.sheetsByIndex[0]
      console.log(`Using sheet: ${sheet.title}`)
      return sheet
    } catch (error) {
      console.error("Error getting main sheet:", error)
      return null
    }
  }

  async getUnprocessedRows() {
    try {
      const sheet = await this.getMainSheet()
      if (!sheet) {
        console.log(`⚠️  No sheet found`)
        return []
      }

      // Load the sheet data
      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()

      if (rows.length === 0) {
        console.log(`ℹ️  No rows found in sheet`)
        return []
      }

      console.log(`📊 Total rows in sheet: ${rows.length}`)
      console.log(`📋 Headers: ${sheet.headerValues.join(", ")}`)

      // Find the rating column name
      const ratingColumnName = sheet.headerValues.find((header) => header && header.toLowerCase().includes("rating"))

      console.log(`🎯 Rating column name: ${ratingColumnName || "Not found"}`)

      if (!ratingColumnName) {
        console.log(`⚠️  No rating column found in headers: ${sheet.headerValues.join(", ")}`)
        // If no rating column, consider all rows as unprocessed
        return rows
      }

      const unprocessedRows = rows.filter((row, index) => {
        try {
          // Use the proper row.get() method with the rating column name
          const ratingValue = row.get(ratingColumnName)
          const isEmpty = !ratingValue || ratingValue.toString().trim() === ""

          if (!isEmpty) {
            console.log(`✅ Row ${index + 1}: ${row.get("Name") || "Unknown"} - Already processed`)
          } else {
            console.log(`📝 Row ${index + 1}: ${row.get("Name") || "Unknown"} - Needs processing`)
          }

          return isEmpty
        } catch (error) {
          console.error(`Error checking row ${index + 1}:`, error)
          // If there's an error, assume it needs processing
          return true
        }
      })

      console.log(`Found ${unprocessedRows.length} unprocessed rows out of ${rows.length} total rows`)
      return unprocessedRows
    } catch (error) {
      console.error(`Error getting unprocessed rows:`, error)
      return []
    }
  }

async updateRowWithRating(rowIndex: number, rating: number, review: string): Promise<boolean> {
  try {
    const sheet = await this.getMainSheet()
    if (!sheet) return false

    await sheet.loadHeaderRow()
    const rows = await sheet.getRows()

    const dataRowIndex = rowIndex - 2 // Subtract 2: one for 0-based array, one for header row

    if (dataRowIndex < 0 || dataRowIndex >= rows.length) {
      console.error(`Row index ${rowIndex} is out of bounds (valid: 2 to ${rows.length + 1})`)
      return false
    }

    const row = rows[dataRowIndex]

    const ratingColumnName = sheet.headerValues.find(
      (header) => header && header.toLowerCase().includes("rating")
    )

    if (ratingColumnName) {
      row.set(ratingColumnName, review)
      await row.save()
      console.log(`✅ Updated row ${rowIndex} (actual row ${dataRowIndex + 2}) with rating: ${rating}/10`)
      return true
    } else {
      console.error(`❌ Could not find rating column in headers: ${sheet.headerValues.join(", ")}`)
      return false
    }
  } catch (error) {
    console.error(`❌ Error updating row:`, error)
    return false
  }
}


  // Method to get sheet info for debugging
  async getSheetInfo() {
    if (!this.doc) {
      await this.initialize()
    }
    if (!this.doc) return null

    try {
      const sheet = await this.getMainSheet()
      if (!sheet) return null

      // Load header row to get column names
      await sheet.loadHeaderRow()

      return {
        spreadsheetTitle: this.doc.title,
        sheetTitle: sheet.title,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount,
        headerRow: sheet.headerValues,
        expectedColumns: [
          "Timestamp",
          "Name",
          "Email",
          "Portfolio Link",
          "Resume",
          "Proposal",
          "Github Link",
          "Rating",
        ],
      }
    } catch (error) {
      console.error("Error getting sheet info:", error)
      return null
    }
  }
}
