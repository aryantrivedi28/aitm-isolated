import { type NextRequest, NextResponse } from "next/server"
import { ProcessingService } from "../../../../lib/services/processingService"

export async function POST(request: NextRequest) {
const body = await request.json()
   const sheetUrl = body.sheetUrl
    const processingService = new ProcessingService(sheetUrl)

  try {
    console.log("🧪 Testing improved sheet processing...")
    console.log("⏰ Started at:", new Date().toISOString())

    // Initialize services
    await processingService.initialize()

    // Get sheet info first
    const sheetsService = processingService["sheetsService"]
    const sheetInfo = await sheetsService.getSheetInfo()

    console.log("📋 Sheet Information:")
    console.log("  Title:", sheetInfo?.spreadsheetTitle)
    console.log("  Sheet:", sheetInfo?.sheetTitle)
    console.log("  Rows:", sheetInfo?.rowCount)
    console.log("  Columns:", sheetInfo?.columnCount)
    console.log("  Headers:", sheetInfo?.headerRow)

    // Get unprocessed rows for testing
    console.log("\n🔍 Getting unprocessed rows...")
    const unprocessedRows = await sheetsService.getUnprocessedRows()
    console.log(`📊 Found ${unprocessedRows.length} unprocessed rows`)

    if (unprocessedRows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No unprocessed rows found - all rows have been processed",
        sheetInfo,
        processedCount: 0,
        totalUnprocessedRows: 0,
        testedRows: 0,
        results: [],
      })
    }

    // Process only the first 5 rows for testing
    const testRows = unprocessedRows.slice(0, 5)
    console.log(`\n🔬 Testing with first ${testRows.length} rows...`)

    const results = []

    for (let i = 0; i < testRows.length; i++) {
      const row = testRows[i]
      console.log(`\n--- Testing Row ${i + 1} (Sheet Row ${row.rowNumber}) ---`)

      try {
        // Extract candidate data using the row.get() method
        const candidateData = {
          timestamp: safeGetRowValue(row, "Timestamp") || new Date().toISOString(),
          name: safeGetRowValue(row, "Name") || "Unknown",
          email: safeGetRowValue(row, "Email") || "No email",
          portfolioUrl: safeGetRowValue(row, "Portfolio Link") || "",
          resumeFile: safeGetRowValue(row, "Resume") || "",
          proposalText: safeGetRowValue(row, "Proposal") || "",
          github: safeGetRowValue(row, "Github Link") || "",
        }

        console.log("📝 Extracted data:")
        console.log(`  Name: "${candidateData.name}"`)
        console.log(`  Email: "${candidateData.email}"`)
        console.log(`  Portfolio: "${candidateData.portfolioUrl}"`)
        console.log(`  Resume: "${candidateData.resumeFile}"`)
        console.log(`  Proposal: "${candidateData.proposalText?.substring(0, 100) || "N/A"}..."`)
        console.log(`  GitHub: "${candidateData.github}"`)

        // Check content availability - including proposal files
        const hasProposalText = candidateData.proposalText && candidateData.proposalText.length > 10
        const hasProposalFile = isFileUrl(candidateData.proposalText)
        const hasResume = candidateData.resumeFile && candidateData.resumeFile.includes("drive.google.com")
        const hasPortfolio = candidateData.portfolioUrl && candidateData.portfolioUrl.length > 10

        console.log(`📊 Content check:`)
        console.log(`  Proposal Text: ${hasProposalText}`)
        console.log(`  Proposal File: ${hasProposalFile}`)
        console.log(`  Resume: ${hasResume}`)
        console.log(`  Portfolio: ${hasPortfolio}`)

        let status = "ready_for_processing"
        let message = ""

        if (!hasProposalText && !hasProposalFile && !hasResume && !hasPortfolio) {
          status = "insufficient_data"
          message =
            "Insufficient data - Missing proposal text/file, resume file, and portfolio. Please provide at least one of these for evaluation."
        } else {
          const availableContent = [
            hasProposalText ? "proposal text" : null,
            hasProposalFile ? "proposal file" : null,
            hasResume ? "resume" : null,
            hasPortfolio ? "portfolio" : null,
          ].filter(Boolean)

          message = `Ready for AI analysis - Has: ${availableContent.join(", ")}`
        }

        results.push({
          rowNumber: row.rowNumber,
          candidateData,
          contentAvailability: {
            hasProposalText,
            hasProposalFile,
            hasResume,
            hasPortfolio,
          },
          status,
          message,
        })
      } catch (error) {
        console.error(`❌ Error processing row ${i + 1}:`, error)
        results.push({
          rowNumber: row.rowNumber,
          error: error instanceof Error ? error.message : "Unknown error",
          status: "error",
        })
      }
    }

    console.log("\n✅ Test processing completed!")

    return NextResponse.json({
      success: true,
      message: "Test processing completed",
      sheetInfo,
      totalUnprocessedRows: unprocessedRows.length,
      testedRows: testRows.length,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Test processing failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await processingService.close()
  }
}

// Helper function to safely get row values
function safeGetRowValue(row: any, columnName: string): string {
  try {
    const value = row.get(columnName)
    return value ? value.toString().trim() : ""
  } catch (error) {
    console.warn(`Could not get value for column "${columnName}":`, error)
    return ""
  }
}

// Helper function to check if text is a file URL
function isFileUrl(text: string | undefined): boolean {
  if (!text) return false
  return (
    text.includes("drive.google.com") ||
    text.includes("docs.google.com") ||
    text.includes("dropbox.com") ||
    text.includes("onedrive.com") ||
    (text.startsWith("http") &&
      (text.includes(".pdf") || text.includes(".doc") || text.includes(".docx") || text.includes(".txt")))
  )
}

export async function GET(request: NextRequest) {
  // Return a simple test interface
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Sheet Processing</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 0; }
            .result { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; white-space: pre-wrap; font-family: monospace; }
            .success { border-left: 4px solid #4CAF50; }
            .error { border-left: 4px solid #f44336; }
            .warning { border-left: 4px solid #ff9800; }
            .row-result { background: #e8f4f8; margin: 10px 0; padding: 10px; border-radius: 3px; }
            .insufficient { background: #fff3cd; border-left: 4px solid #ffc107; }
            .ready { background: #d4edda; border-left: 4px solid #28a745; }
        </style>
    </head>
    <body>
        <h1>🧪 Test Sheet Processing</h1>
        <p>This will test the improved data handling with your Google Sheet, including support for proposal files.</p>
        
        <button onclick="testProcessing()">🚀 Test Sheet Processing</button>
        <button onclick="clearResults()">🧹 Clear Results</button>
        
        <div id="result"></div>

        <script>
            async function testProcessing() {
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<div class="result">⏳ Testing sheet processing...</div>';
                
                try {
                    const response = await fetch('/api/test-sheet-processing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        let html = \`<div class="result success">
✅ Test Processing Complete

📋 Sheet Info:
  Title: \${data.sheetInfo?.spreadsheetTitle || 'N/A'}
  Sheet: \${data.sheetInfo?.sheetTitle || 'N/A'}
  Total Rows: \${data.sheetInfo?.rowCount || 'N/A'}
  Headers: \${data.sheetInfo?.headerRow?.join(', ') || 'N/A'}

📊 Processing Results:
  Total Unprocessed: \${data.totalUnprocessedRows}
  Tested Rows: \${data.testedRows}

🔍 Row Analysis:\`;

                        if (data.results && data.results.length > 0) {
                            data.results.forEach((result, index) => {
                                const statusClass = result.status === 'insufficient_data' ? 'insufficient' : 'ready';
                                html += \`
<div class="row-result \${statusClass}">
<strong>Row \${index + 1} (Sheet Row \${result.rowNumber})</strong>
Name: "\${result.candidateData?.name || 'N/A'}"
Email: "\${result.candidateData?.email || 'N/A'}"
Portfolio: "\${result.candidateData?.portfolioUrl || 'N/A'}"
Resume: "\${result.candidateData?.resumeFile || 'N/A'}"
Proposal: "\${result.candidateData?.proposalText?.substring(0, 100) || 'N/A'}..."
GitHub: "\${result.candidateData?.github || 'N/A'}"

Content Available:
  ✓ Proposal Text: \${result.contentAvailability?.hasProposalText ? 'Yes' : 'No'}
  ✓ Proposal File: \${result.contentAvailability?.hasProposalFile ? 'Yes' : 'No'}
  ✓ Resume: \${result.contentAvailability?.hasResume ? 'Yes' : 'No'}
  ✓ Portfolio: \${result.contentAvailability?.hasPortfolio ? 'Yes' : 'No'}

Status: \${result.status}
Message: \${result.message || 'N/A'}
</div>\`;
                            });
                        } else {
                            html += \`
<div class="row-result">
No rows to test - all rows may already be processed.
</div>\`;
                        }

                        html += '</div>';
                        resultDiv.innerHTML = html;
                    } else {
                        resultDiv.innerHTML = \`<div class="result error">❌ Error: \${data.error}</div>\`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error">❌ Network Error: \${error.message}</div>\`;
                }
            }

            function clearResults() {
                document.getElementById('result').innerHTML = '';
            }
        </script>
    </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    },
  )
}
