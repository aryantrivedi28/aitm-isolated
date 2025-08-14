"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

export default function NewFormPage() {
  const [formData, setFormData] = useState({
    form_id: "", // Added form_id field for custom IDs
    form_name: "",
    category: "",
    subcategory: "",
    industry: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)

  const categories = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "DevOps",
    "Digital Marketing",
    "Content Writing",
    "Graphic Design",
    "Video Editing",
    "SEO Specialist",
  ]

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Education",
    "Real Estate",
    "Entertainment",
    "Non-profit",
    "Manufacturing",
    "Consulting",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create form")
      }

      setResult({
        success: true,
        url: data.url,
      })

      // Reset form
      setFormData({
        form_id: "", // Reset form_id field
        form_name: "",
        category: "",
        subcategory: "",
        industry: "",
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-[#241C15] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Create New Gig Form</h1>
          <p className="text-gray-300 text-lg">Set up a new form to collect freelancer applications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form ID *</label>
              <input
                type="text"
                required
                value={formData.form_id}
                onChange={(e) => handleInputChange("form_id", e.target.value)}
                placeholder="e.g., reactjs1, nodejs2, fullstack1"
                pattern="[a-zA-Z0-9]+"
                title="Only letters and numbers allowed"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use simple IDs like "reactjs1", "nodejs2" - only letters and numbers allowed
              </p>
            </div>

            {/* Form Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form Name *</label>
              <input
                type="text"
                required
                value={formData.form_name}
                onChange={(e) => handleInputChange("form_name", e.target.value)}
                placeholder="e.g., Senior React Developer Position"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
              <input
                type="text"
                required
                value={formData.subcategory}
                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                placeholder="e.g., Frontend, Backend, Full-stack"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <select
                required
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              >
                <option value="">Select an industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Form..." : "Create Form"}
            </motion.button>
          </form>

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              {result.success ? (
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Form Created Successfully!</h3>
                  <p className="text-green-700 mb-3">Your form is ready to share with freelancers:</p>
                  <div className="bg-white p-3 rounded border">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {result.url}
                    </a>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.url!)}
                    className="mt-2 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Copy Link
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
