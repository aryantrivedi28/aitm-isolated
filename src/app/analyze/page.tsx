"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function AnalyzeSheetPage() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("🔄 Analyzing prompt and preparing sheet...")
    setResult(null)

    try {
      const res = await fetch("/api/analyze-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetUrl,
          prompt,
        }),
      })

      const data = await res.json()
      setResult(data)

      if (data.success) {
        setStatus(
          `✅ Completed! ${data.rowsAnalyzed} rows processed. Fields created: ${data.fieldsCreated?.join(", ") || "None"}`,
        )
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
        <h1 className="text-2xl font-semibold text-black mb-6 text-center">AI Sheet Analyzer - Auto Fields</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">✨ How it works:</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Just provide your Google Sheet URL and evaluation prompt</li>
            <li>• AI automatically determines what columns/fields are needed</li>
            <li>• Missing columns are created automatically in your sheet</li>
            <li>• Each candidate gets unique, personalized evaluation</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Google Sheet URL:</label>
            <input
              type="url"
              required
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Make sure your sheet is shared with view/edit permissions</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Evaluation Prompt:</label>
            <textarea
              rows={8}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Rate each candidate from 1-10 based on their technical skills, experience, and portfolio quality. Also provide a skill assessment for JavaScript, React, and Node.js. Include hiring recommendation (Yes/No/Maybe) and salary range suggestion."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific about what you want to evaluate. The AI will automatically create the necessary columns in
              your sheet.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#FFE01B] text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "🤖 Analyzing & Processing..." : "🚀 Run AI Analysis"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-black">
          <strong>Status:</strong>
          <div className="mt-2 whitespace-pre-wrap">{status}</div>
          {result?.error && <div className="text-red-600 mt-2 font-medium">{result.error}</div>}
          {result?.success && (
            <div className="text-green-600 mt-2 font-medium">
              ✅ Successfully analyzed {result.rowsAnalyzed} rows!
              {result.fieldsCreated && (
                <div className="text-sm text-gray-600 mt-1">Auto-created fields: {result.fieldsCreated.join(", ")}</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </main>
  )
}
