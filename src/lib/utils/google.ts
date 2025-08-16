export function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

export function isValidGoogleSheetUrl(url: string): boolean {
  return /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url)
}

export function createPublicViewUrl(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`
}
