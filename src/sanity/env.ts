// Debug: Check what environment variables are available
if (typeof window === "undefined") {
  console.log("Available env vars:", {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  })
}

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-07-16"

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "v80x384s"

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}

// For server-side usage (API routes, server components)
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // Server-only token
  useCdn: process.env.NODE_ENV === "production",
}

// For client-side usage (components, client-side code)
export const publicSanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
}

// Only validate in development and only on server
export function validateSanityConfig() {
  if (typeof window !== "undefined" || process.env.NODE_ENV === "production") {
    return // Skip validation in browser or production
  }

  const requiredVars = ["NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing Sanity environment variables: ${missing.join(", ")}\n` +
        "Using fallback values. Please check your .env.local file.",
    )
  }
}
