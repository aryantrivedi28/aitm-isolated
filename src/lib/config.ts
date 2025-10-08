export const CONFIG = {
  // OpenAI Configuration (use defaults unless overridden)
  OPENAI_MODEL: "gpt-4o-mini",
  OPENAI_MAX_TOKENS: 1000,
  OPENAI_TEMPERATURE: 0.7,

  // Google Service Account (keep static)
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

  // Scraping Configuration
  MAX_PORTFOLIO_CHARS: 3000,
  MAX_PROPOSAL_CHARS: 2000,
  SCRAPING_TIMEOUT: 15000,
  FETCH_TIMEOUT: 10000,
  MAX_RESUME_SIZE: 10 * 1024 * 1024,
  SUPPORTED_FILE_TYPES: ["pdf", "docx"],
  USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

  // Rate Limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,

  // Delay + Retry
  PROCESSING_DELAY: 2000,
  MAX_RETRIES: 3,

  // Debug Mode
  DEBUG_MODE: true,
  LOG_LEVEL: "info",
} as const

// --- ✅ Utility Functions ---

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY2 && process.env.OPENAI_API_KEY2.startsWith("sk-")
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(
    CONFIG.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    CONFIG.GOOGLE_PRIVATE_KEY?.includes("BEGIN PRIVATE KEY")
  )
}

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!isOpenAIConfigured()) errors.push("OpenAI API key is missing or invalid")
  if (!isGoogleSheetsConfigured()) errors.push("Google Sheets configuration is incomplete")

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Log configuration status only in backend/server
if (typeof window === "undefined") {
  const configStatus = validateConfig()
  console.log("🔧 Configuration Status:")
  console.log(`  OpenAI: ${isOpenAIConfigured() ? "✅" : "❌"}`)
  console.log(`  Google Sheets: ${isGoogleSheetsConfigured() ? "✅" : "❌"}`)

  if (!configStatus.valid) {
    console.error("❌ Configuration errors:", configStatus.errors)
  } else {
    console.log("✅ All configurations are valid")
  }
}
