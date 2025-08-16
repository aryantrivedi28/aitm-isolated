"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AnalyzeSheetPage() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [sheetName, setSheetName] = useState("Sheet1")
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [sheetPreview, setSheetPreview] = useState<any>(null)
  const [columnMapping, setColumnMapping] = useState<any>({})

  const handlePreviewSheet = async () => {
    if (!sheetUrl) return

    try {
      const res = await fetch("/api/preview-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetUrl, sheetName }),
      })

      const data = await res.json()
      if (data.success) {
        setSheetPreview(data.sheetInfo)
        setColumnMapping(data.columnMapping)
      }
    } catch (error) {
      console.error("Preview failed:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("🔄 Processing...")
    setResult(null)

    try {
      const res = await fetch("/api/analyze-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetUrl,
          sheetName,
          prompt,
          columnMapping,
        }),
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
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-semibold text-black mb-6 text-center">AI Sheet Analyzer - Universal</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-gray-600 mb-1">Sheet Name:</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Sheet1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePreviewSheet}
            className="w-full py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
          >
            Preview Sheet Structure
          </button>

          {sheetPreview && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Sheet: {sheetPreview.sheetTitle}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {sheetPreview.rowCount} rows × {sheetPreview.columnCount} columns
              </p>
              <div className="text-sm">
                <strong>Detected Columns:</strong>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(columnMapping).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      {key}: <span className="font-mono">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-600 mb-1">Analysis Prompt:</label>
            <textarea
              rows={6}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Rate this freelancer from 1-10 based on their skills and experience. Consider their resume, portfolio, and proposal quality..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#FFE01B] text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
          >
            {isLoading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-black whitespace-pre-wrap">
          <strong>Status:</strong> {status}
          {result?.error && <div className="text-red-600 mt-2">{result.error}</div>}
          {result?.success && (
            <div className="text-green-600 mt-2">Successfully analyzed {result.rowsAnalyzed} rows!</div>
          )}
        </div>
      </motion.div>
    </main>
  )
}
