"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface AnalysisResult {
  success: boolean
  processed: number
  failed: number
  results: any[]
}

export default function SheetAnalyzer() {
  const [formId, setFormId] = useState("")
  const [sheetUrl, setSheetUrl] = useState("")
  const [sheetName, setSheetName] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [exportResult, setExportResult] = useState<any>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleExport = async () => {
    if (!formId || !sheetUrl) {
      alert("Please fill in Form ID and Sheet URL")
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch("/api/export-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_id: formId,
          sheet_url: sheetUrl,
          sheet_name: sheetName || undefined,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setExportResult(result)
      } else {
        alert(`Export failed: ${result.error}`)
      }
    } catch (error) {
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleAnalyze = async () => {
    if (!sheetUrl) {
      alert("Please provide sheet URL")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-freelancers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          sheet_name: sheetName || undefined,
          custom_prompt: customPrompt,
          category: exportResult?.form_details?.category,
          tech_stack: exportResult?.form_details?.tech_stack,
          requirements: exportResult?.form_details,
        }),
      })

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      alert("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#241C15] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Freelancer Sheet Analyzer</h1>
          <p className="text-gray-300">Export Supabase data to Google Sheets and analyze with AI</p>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Step 1: Export Data to Sheet</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Form ID</label>
              <input
                type="text"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                placeholder="e.g., python1, reactjs2"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-[#FFE01B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sheet Name (Optional)</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="e.g., Python Developers (auto-detected if empty)"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-[#FFE01B] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Google Sheet URL</label>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-[#FFE01B] focus:outline-none"
            />
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#FFE01B] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? "Exporting..." : "Export to Sheet"}
          </button>

          {exportResult && (
            <div className="mt-4 p-4 bg-green-800 rounded-lg">
              <h3 className="font-semibold">Export Successful!</h3>
              <p>{exportResult.message}</p>
              <div className="mt-2 text-sm">
                <p>
                  <strong>Category:</strong> {exportResult.form_details.category}
                </p>
                <p>
                  <strong>Tech Stack:</strong> {exportResult.form_details.tech_stack}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Step 2: AI Analysis</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Custom Analysis Prompt (Optional)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add specific requirements or focus areas for analysis..."
              rows={4}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-[#FFE01B] focus:outline-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !exportResult}
            className="bg-[#FFE01B] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#FCD34D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
          </button>

          {analysisResult && (
            <div className="mt-4 p-4 bg-blue-800 rounded-lg">
              <h3 className="font-semibold">Analysis Complete!</h3>
              <p>Processed: {analysisResult.processed} freelancers</p>
              <p>Failed: {analysisResult.failed} freelancers</p>
              <p className="text-sm mt-2">Check your Google Sheet for detailed ratings and reviews.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
