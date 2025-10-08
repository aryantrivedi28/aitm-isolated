import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { CONFIG } from "../config"
import axios from "axios"

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

  async getSheet(sheetName?: string) {
    if (!this.doc) throw new Error("Google Sheets not initialized")

    try {
      let sheet
      if (sheetName) {
        // Try to find sheet by name
        sheet = this.doc.sheetsByTitle[sheetName]
        if (!sheet) {
          console.log(`⚠️ Sheet "${sheetName}" not found, available sheets:`, Object.keys(this.doc.sheetsByTitle))
          // Fallback to first sheet
          sheet = this.doc.sheetsByIndex[0]
        }
      } else {
        // Default to first sheet
        sheet = this.doc.sheetsByIndex[0]
      }

      console.log(`📄 Using sheet: ${sheet.title}`)
      return sheet
    } catch (error) {
      console.error("❌ Error getting sheet:", error)
      return null
    }
  }

  async getMainSheet() {
    return this.getSheet()
  }

  async getUnprocessedRows(requiredFields: string[] = [], sheetName?: string) {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return []

      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()

      const checkColumns =
        requiredFields.length > 0
          ? requiredFields
          : sheet.headerValues.filter((h) => h?.toLowerCase().includes("rating") || h?.toLowerCase().includes("review"))

      if (checkColumns.length === 0) {
        console.log("⚠️ No tracking columns found, processing all rows")
        return rows
      }

      const unprocessedRows = rows.filter((row, index) => {
        // Check if any of the required fields are empty
        const isEmpty = checkColumns.some((columnName) => {
          const value = row.get(columnName)
          return !value || value.toString().trim() === ""
        })

        console.log(
          `${isEmpty ? "📝 Needs processing" : "✅ Already processed"} — Row ${
            index + 2
          }: ${row.get("Name") || row.get("form_name") || "Unnamed"}`,
        )
        return isEmpty
      })

      return unprocessedRows
    } catch (error) {
      console.error("❌ Error loading unprocessed rows:", error)
      return []
    }
  }

  async checkDriveLinkAccess(columnName = "Drive Link", sheetName?: string) {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return []

      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()

      const results = []

      for (const row of rows) {
        const link = row.get(columnName)

        if (!link) {
          results.push({ name: row.get("Name"), link, status: "❌ No link" })
          continue
        }

        try {
          const res = await axios.get(link, {
            maxRedirects: 5,
            validateStatus: (status) => status < 500,
          })

          const isPublic = res.status === 200

          results.push({
            name: row.get("Name"),
            link,
            status: isPublic ? "✅ Public" : `⚠️ Not Public (${res.status})`,
          })
        } catch (err: any) {
          results.push({
            name: row.get("Name"),
            link,
            status: `❌ Error (${err.response?.status || "Network"})`,
          })
        }
      }

      console.table(results)
      return results
    } catch (error) {
      console.error("❌ Error checking Drive links:", error)
      return []
    }
  }

  async updateRowWithRating(
    rowIndex: number,
    rating: number,
    review: string,
    ratingColumn: string,
    reviewColumn: string,
    sheetName?: string,
  ): Promise<boolean> {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return false

      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()
      const dataRowIndex = rowIndex - 2

      if (dataRowIndex < 0 || dataRowIndex >= rows.length) {
        console.error(`❌ Invalid row index: ${rowIndex}`)
        return false
      }

      const row = rows[dataRowIndex]

      // Check if columns exist, if not create them
      const finalRatingColumn = ratingColumn
      const finalReviewColumn = reviewColumn

      if (!sheet.headerValues.includes(ratingColumn)) {
        console.log(`📝 Adding missing rating column: ${ratingColumn}`)
        await this.addColumnToSheet(ratingColumn, sheetName)
        await sheet.loadHeaderRow() // Reload headers after adding column
      }

      if (!sheet.headerValues.includes(reviewColumn)) {
        console.log(`📝 Adding missing review column: ${reviewColumn}`)
        await this.addColumnToSheet(reviewColumn, sheetName)
        await sheet.loadHeaderRow() // Reload headers after adding column
      }

      row.set(finalRatingColumn, rating)
      row.set(finalReviewColumn, review)

      await row.save()

      console.log(`✅ Row ${rowIndex} updated — Rating: ${rating}, Review: ${review.substring(0, 100)}...`)
      return true
    } catch (error) {
      console.error("❌ Error updating row:", error)
      return false
    }
  }

  async addColumnToSheet(columnName: string, sheetName?: string): Promise<boolean> {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return false

      await sheet.loadHeaderRow()
      // Add the new column header
      const newColumnIndex = sheet.headerValues.length
      await sheet.loadCells(`${this.getColumnLetter(newColumnIndex)}1`)
      const headerCell = sheet.getCell(0, newColumnIndex)
      headerCell.value = columnName
      await sheet.saveUpdatedCells()

      console.log(`✅ Added new column: ${columnName}`)
      return true
    } catch (error) {
      console.error(`❌ Error adding column ${columnName}:`, error)
      return false
    }
  }

  private getColumnLetter(index: number): string {
    let result = ""
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result
      index = Math.floor(index / 26) - 1
    }
    return result
  }

  async getSheetInfo(sheetName?: string) {
    try {
      await this.initialize()
      const sheet = await this.getSheet(sheetName)
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

  async ensureColumnsExist(
    columnNames: string[],
    descriptions?: Record<string, string>,
    sheetName?: string,
  ): Promise<boolean> {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return false

      await sheet.loadHeaderRow()
      const existingHeaders = sheet.headerValues
      const missingColumns = columnNames.filter((col) => !existingHeaders.includes(col))

      if (missingColumns.length === 0) {
        console.log("✅ All required columns already exist")
        return true
      }

      console.log(`📝 Adding ${missingColumns.length} missing columns:`, missingColumns)

      for (const columnName of missingColumns) {
        const success = await this.addColumnToSheet(columnName, sheetName)
        if (!success) {
          console.error(`❌ Failed to add column: ${columnName}`)
          return false
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      await sheet.loadHeaderRow()
      console.log("✅ All required columns created successfully")
      return true
    } catch (error) {
      console.error("❌ Error ensuring columns exist:", error)
      return false
    }
  }

  async updateRowWithMultipleFields(
    rowIndex: number,
    fieldValues: Record<string, any>,
    candidateName?: string,
    sheetName?: string,
  ): Promise<boolean> {
    try {
      const sheet = await this.getSheet(sheetName)
      if (!sheet) return false

      await sheet.loadHeaderRow()
      const rows = await sheet.getRows()
      const dataRowIndex = rowIndex - 2

      if (dataRowIndex < 0 || dataRowIndex >= rows.length) {
        console.error(`❌ Invalid row index: ${rowIndex}`)
        return false
      }

      const row = rows[dataRowIndex]

      // Update all field values
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (sheet.headerValues.includes(fieldName)) {
          row.set(fieldName, value)
        } else {
          console.warn(`⚠️ Column '${fieldName}' not found in sheet`)
        }
      })

      await row.save()

      const fieldSummary = Object.entries(fieldValues)
        .map(([key, value]) => `${key}: ${typeof value === "string" ? value.substring(0, 50) + "..." : value}`)
        .join(", ")

      console.log(`✅ Row ${rowIndex} updated for ${candidateName || "candidate"} — ${fieldSummary}`)
      return true
    } catch (error) {
      console.error("❌ Error updating row with multiple fields:", error)
      return false
    }
  }

  async getAvailableSheets(): Promise<string[]> {
    try {
      await this.initialize()
      return Object.keys(this.doc.sheetsByTitle)
    } catch (error) {
      console.error("❌ Error getting available sheets:", error)
      return []
    }
  }
}
