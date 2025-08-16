export interface FreelancerData {
  name?: string
  email?: string
  phone?: string
  github?: string
  resumeContent?: string
  portfolioContent?: string
  proposalContent?: string
  githubContent?: string
  [key: string]: any // Allow additional dynamic fields
}

export interface AIAnalysisResult {
  rating: number
  review: string
}

export interface SheetColumnMapping {
  nameColumn?: string
  emailColumn?: string
  phoneColumn?: string
  resumeColumn?: string
  portfolioColumn?: string
  githubColumn?: string
  proposalColumn?: string
  ratingColumn?: string
  reviewColumn?: string
  experienceColumn?: string
  [key: string]: string | undefined
}

export interface SheetInfo {
  spreadsheetTitle: string
  sheetTitle: string
  rowCount: number
  columnCount: number
  headerRow: string[]
}
