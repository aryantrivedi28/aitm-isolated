"use client"

import { useState } from "react"
import { motion } from "framer-motion"

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
    <main className="bg-[#241C15] min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-semibold text-black mb-6 text-center">
          Analyze Freelancers via OpenAI
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Google Sheet URL:</label>
            <input
              type="url"
              required
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Sheet Name (optional):</label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Sheet1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Custom Prompt:</label>
            <textarea
              rows={8}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Rate candidate from 1-10 based on {{Skills}}, {{Experience}}..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#FFE01B] text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
          >
            {isLoading ? "Analyzing..." : "Run Analysis"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-black whitespace-pre-wrap">
          <strong>Status:</strong> {status}
          {result?.error && <div className="text-red-600 mt-2">{result.error}</div>}
        </div>
      </motion.div>
    </main>
  )
}
