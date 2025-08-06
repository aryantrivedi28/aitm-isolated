import { type NextRequest, NextResponse } from "next/server"
import { CONFIG, isOpenAIConfigured, validateConfig } from "../../../../lib/config"
import OpenAI from "openai"

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing OpenAI connection...")

    // Check configuration
    const configStatus = validateConfig()
    if (!configStatus.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Configuration invalid",
          details: configStatus.errors,
        },
        { status: 400 },
      )
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI not configured",
          details: ["OpenAI API key is missing or invalid"],
        },
        { status: 400 },
      )
    }

    // Test OpenAI connection
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY2,
    })

    console.log("📡 Testing OpenAI API connection...")

    // Simple test prompt
    const completion = await openai.chat.completions.create({
      model: CONFIG.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond with exactly: 'OpenAI connection successful!'",
        },
        {
          role: "user",
          content: "Test connection",
        },
      ],
      max_tokens: 50,
      temperature: 0,
    })

    const response = completion.choices[0].message.content || ""
    console.log("✅ OpenAI response:", response)

    return NextResponse.json({
      success: true,
      message: "OpenAI connection successful",
      response: response,
      model: CONFIG.OPENAI_MODEL,
      usage: completion.usage,
    })
  } catch (error) {
    console.error("❌ OpenAI test failed:", error)

    let errorMessage = "Unknown error"
    let errorCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      if (error.message.includes("401")) {
        errorMessage = "Invalid API key"
        errorCode = 401
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limit exceeded or quota exhausted"
        errorCode = 429
      } else if (error.message.includes("403")) {
        errorMessage = "Access forbidden - check API key permissions"
        errorCode = 403
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: errorCode },
    )
  }
}
