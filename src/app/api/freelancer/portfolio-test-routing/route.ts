import { type NextRequest, NextResponse } from "next/server"
import { PortfolioScrapingService } from "../../../../lib/services/porfolioScrapingService"

export async function POST(request: NextRequest) {
  const scrapingService = new PortfolioScrapingService()

  try {
    console.log("🧪 Testing portfolio parsing...")

    const { portfolioUrl } = await request.json()

    if (!portfolioUrl) {
      return NextResponse.json(
        { success: false, error: "Portfolio URL is required" },
        { status: 400 }
      )
    }

    console.log(`🌐 Testing portfolio parsing for: ${portfolioUrl}`)

    const initialized = await scrapingService.initialize()
    if (!initialized) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize browser" },
        { status: 500 }
      )
    }

    const content = await scrapingService.parsePortfolio(portfolioUrl)

    console.log(`✅ Portfolio parsed: ${content.length} characters`)
    console.log(`📝 First 500 chars: ${content.substring(0, 500)}...`)

    return NextResponse.json({
      success: true,
      portfolioUrl,
      contentLength: content.length,
      content,
      preview: content.substring(0, 1000) + (content.length > 1000 ? "..." : ""),
    })
  } catch (error) {
    console.error("❌ Portfolio parsing failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  } finally {
    await scrapingService.close()
  }
}

export async function GET(request: NextRequest) {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Portfolio Parsing</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
            button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
            .result { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; white-space: pre-wrap; }
            .success { border-left: 4px solid #4CAF50; }
            .error { border-left: 4px solid #f44336; }
        </style>
    </head>
    <body>
        <h1> Test Portfolio Parsing</h1>
        <p>Test if the system can properly parse content from public portfolio links.</p>
        
        <form id="testForm">
            <label>Portfolio URL:</label>
            <input type="url" id="portfolioUrl" placeholder="https://your-portfolio.com" required>
            
            <button type="submit"> Test Portfolio Parsing</button>
        </form>
        
        <div id="result"></div>

        <script>
            document.getElementById('testForm').addEventListener('submit', async (e) => {
                e.preventDefault()
                const portfolioUrl = document.getElementById('portfolioUrl').value
                const resultDiv = document.getElementById('result')
                resultDiv.innerHTML = '<div class="result"> Parsing portfolio...</div>'

                try {
                    const response = await fetch('/api/freelancer/portfolio-test-routing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ portfolioUrl })
                    })
                    const data = await response.json()

                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div class="result success">
                                <h3> Portfolio Parsing Successful</h3>
                                <p><strong>URL:</strong> \${data.portfolioUrl}</p>
                                <p><strong>Content Length:</strong> \${data.contentLength} characters</p>
                                <p><strong>Preview:</strong></p>
                                <div style="background: #fff; padding: 10px; border: 1px solid #ddd; max-height: 300px; overflow-y: auto;">
                                    \${data.preview}
                                </div>
                            </div>
                        \`
                    } else {
                        resultDiv.innerHTML = \`
                            <div class="result error">
                                <h3> Portfolio Parsing Failed</h3>
                                <p><strong>Error:</strong> \${data.error}</p>
                                \${data.details ? \`<p><strong>Details:</strong> \${data.details}</p>\` : ''}
                            </div>
                        \`
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error"> Network Error: \${error.message}</div>\`
                }
            })
        </script>
    </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  )
}
