import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileUrls, candidateName, email } = await request.json()

    if (!fileUrls || !Array.isArray(fileUrls)) {
      return NextResponse.json(
        {
          success: false,
          error: "File URLs array is required",
        },
        { status: 400 },
      )
    }

    const results = []

    for (const fileUrl of fileUrls) {
      const result = await checkFileAccess(fileUrl)
      results.push({
        url: fileUrl,
        accessible: result.accessible,
        message: result.message,
        fixInstructions: result.fixInstructions,
      })
    }

    const allAccessible = results.every((r) => r.accessible)

    return NextResponse.json({
      success: true,
      candidateName,
      email,
      allFilesAccessible: allAccessible,
      fileResults: results,
      overallMessage: allAccessible
        ? "✅ All files are properly shared and accessible!"
        : "❌ Some files need sharing permissions updated. Follow the instructions below.",
    })
  } catch (error) {
    console.error("❌ File sharing check failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function checkFileAccess(fileUrl: string): Promise<{
  accessible: boolean
  message: string
  fixInstructions: string
}> {
  try {
    if (!fileUrl || !fileUrl.includes("drive.google.com")) {
      return {
        accessible: false,
        message: "Not a valid Google Drive URL",
        fixInstructions: "Please provide a valid Google Drive sharing link",
      }
    }

    // Extract file ID
    const fileId = extractFileId(fileUrl)
    if (!fileId) {
      return {
        accessible: false,
        message: "Could not extract file ID from URL",
        fixInstructions: "Please check the Google Drive URL format",
      }
    }

    // Try to access the file
    const testUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    const response = await fetch(testUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (response.ok) {
      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("text/html")) {
        return {
          accessible: true,
          message: "✅ File is publicly accessible",
          fixInstructions: "No action needed - file is properly shared",
        }
      }
    }

    return {
      accessible: false,
      message: "❌ File is not publicly accessible",
      fixInstructions: `🔧 TO FIX:
1. Open this file: ${fileUrl}
2. Click the "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Copy link"
6. Use the new link in your form submission

File ID: ${fileId}`,
    }
  } catch (error) {
    return {
      accessible: false,
      message: "❌ Could not check file accessibility",
      fixInstructions: "Please ensure the file is a valid Google Drive link and try the sharing steps above",
    }
  }
}

function extractFileId(url: string): string {
  // Handle different Google Drive URL formats
  let fileId = ""

  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  let match = url.match(/\/file\/d\/(.*?)\/view/)
  if (match && match[1]) {
    fileId = match[1]
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    match = url.match(/[?&]id=([^&]+)/)
    if (match && match[1]) {
      fileId = match[1]
    }
  }

  // Format 3: https://drive.google.com/file/d/FILE_ID/edit
  if (!fileId) {
    match = url.match(/\/file\/d\/(.*?)\/edit/)
    if (match && match[1]) {
      fileId = match[1]
    }
  }

  return fileId
}

export async function GET(request: NextRequest) {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Fix Google Drive File Sharing</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
            button { background: #0070f3; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 0; }
            .result { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; white-space: pre-wrap; }
            .success { border-left: 4px solid #4CAF50; }
            .error { border-left: 4px solid #f44336; }
            .file-result { background: #e8f4f8; margin: 10px 0; padding: 10px; border-radius: 3px; }
            .accessible { border-left: 4px solid #28a745; }
            .not-accessible { border-left: 4px solid #dc3545; }
        </style>
    </head>
    <body>
        <h1>🔧 Fix Google Drive File Sharing</h1>
        <p>Check if your Google Drive files are properly shared for the resume evaluation system.</p>
        
        <form id="checkForm">
            <label>Candidate Name:</label>
            <input type="text" id="candidateName" placeholder="Your name" required>
            
            <label>Email:</label>
            <input type="email" id="email" placeholder="your.email@example.com" required>
            
            <label>Google Drive File URLs (one per line):</label>
            <textarea id="fileUrls" rows="6" placeholder="https://drive.google.com/file/d/your-file-id/view
https://drive.google.com/open?id=another-file-id" required></textarea>
            
            <button type="submit">🔍 Check File Access</button>
        </form>
        
        <div id="result"></div>

        <script>
            document.getElementById('checkForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const candidateName = document.getElementById('candidateName').value;
                const email = document.getElementById('email').value;
                const fileUrlsText = document.getElementById('fileUrls').value;
                const fileUrls = fileUrlsText.split('\\n').filter(url => url.trim().length > 0);
                
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<div class="result">⏳ Checking file access...</div>';
                
                try {
                    const response = await fetch('/api/freelancer/fix-file-sharing', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ candidateName, email, fileUrls })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        let html = \`<div class="result \${data.allFilesAccessible ? 'success' : 'error'}">
<h3>\${data.overallMessage}</h3>
<p><strong>Candidate:</strong> \${data.candidateName}</p>
<p><strong>Email:</strong> \${data.email}</p>
<p><strong>Files Checked:</strong> \${data.fileResults.length}</p>
</div>\`;

                        data.fileResults.forEach((fileResult, index) => {
                            const statusClass = fileResult.accessible ? 'accessible' : 'not-accessible';
                            html += \`
<div class="file-result \${statusClass}">
<h4>File \${index + 1}</h4>
<p><strong>URL:</strong> \${fileResult.url}</p>
<p><strong>Status:</strong> \${fileResult.message}</p>
<p><strong>Instructions:</strong></p>
<pre>\${fileResult.fixInstructions}</pre>
</div>\`;
                        });

                        resultDiv.innerHTML = html;
                    } else {
                        resultDiv.innerHTML = \`<div class="result error">❌ Error: \${data.error}</div>\`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error">❌ Network Error: \${error.message}</div>\`;
                }
            });
        </script>
    </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    },
  )
}
