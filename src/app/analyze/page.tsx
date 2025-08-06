"use client"

import { useState } from "react"

export default function AnalyzeSheetPage() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [sheetName, setSheetName] = useState("Sheet1")
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; rowsAnalyzed?: number; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setStatus("🔄 Processing...")
    setResult(null)

    try {
      const res = await fetch("/api/freelancer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetUrl, sheetName, prompt }),
      })

      const data = await res.json()
      setResult(data)

      if (data.success) {
        setStatus(`✅ Completed! ${data.rowsAnalyzed} rows processed.`)
      } else {
        setStatus(`❌ Error: ${data.error}`)
      }
    } catch (err: any) {
      setStatus(`❌ Network error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-white text-2xl">Analyze Freelancers via OpenAI</h1>
      <form onSubmit={handleSubmit}>
        <label className="text-white">Google Sheet URL:</label>
        <input
          type="url"
          required
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          style={inputStyle}
        />

        <label className="text-white">Sheet Name (optional):</label>
        <input
          type="text"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          placeholder="Sheet1"
          style={inputStyle}
        />

        <label className="text-white">Custom Prompt:</label>
        <textarea
          rows={10}
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Rate candidate from 1-10 based on {{Skills}}, {{Experience}}..."
          style={{ ...inputStyle, height: 160 }}
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {isLoading ? "Analyzing..." : "Run Analysis"}
        </button>
      </form>

      <div style={{ marginTop: 20, background: "#f7f7f7", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap" }}>
        <strong>Status:</strong> {status}
        {result?.error && <div style={{ color: "red", marginTop: 8 }}>{result.error}</div>}
      </div>
    </main>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px 0",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontSize: "16px",
}
