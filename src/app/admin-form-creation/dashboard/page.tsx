"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Form } from "../../../types/database"

interface FormWithStats extends Form {
  submission_count: number
}

export default function AdminDashboard() {
  const [forms, setForms] = useState<FormWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormsWithStats = async () => {
      try {
        // Fetch all forms
        const formsResponse = await fetch("/api/forms")
        const formsData = await formsResponse.json()

        if (!formsResponse.ok) {
          throw new Error(formsData.error || "Failed to fetch forms")
        }

        // Fetch submission counts for each form
        const formsWithStats = await Promise.all(
          formsData.forms.map(async (form: Form) => {
            try {
              const submissionsResponse = await fetch(`/api/submissions?form_id=${form.form_id}`)
              const submissionsData = await submissionsResponse.json()
              return {
                ...form,
                submission_count: submissionsData.submissions?.length || 0,
              }
            } catch (err) {
              console.error(`Error fetching submissions for form ${form.form_id}:`, err)
              return {
                ...form,
                submission_count: 0,
              }
            }
          }),
        )

        setForms(formsWithStats)
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFormsWithStats()
  }, [])

  const copyFormUrl = (formId: string) => {
    const baseUrl = window.location.origin
    const formUrl = `${baseUrl}/form/${formId}`
    navigator.clipboard.writeText(formUrl)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-300 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#241C15] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300 text-lg">Manage your gig forms and view submissions</p>
          </div>
          <Link
            href="/admin/forms/new"
            className="mt-4 sm:mt-0 bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Create New Form
          </Link>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Forms</h3>
            <p className="text-3xl font-bold text-[#FFE01B]">{forms.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-[#FFE01B]">
              {forms.reduce((total, form) => total + form.submission_count, 0)}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Average per Form</h3>
            <p className="text-3xl font-bold text-[#FFE01B]">
              {forms.length > 0
                ? Math.round(forms.reduce((total, form) => total + form.submission_count, 0) / forms.length)
                : 0}
            </p>
          </div>
        </motion.div>

        {/* Forms List */}
        {forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">No Forms Created Yet</h3>
              <p className="text-gray-300 mb-6">
                Create your first gig form to start collecting freelancer applications.
              </p>
              <Link
                href="/admin/forms/new"
                className="inline-block bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Create Your First Form
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Forms</h2>
            {forms.map((form, index) => (
              <motion.div
                key={form.form_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{form.form_name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-[#FFE01B] text-black px-3 py-1 rounded-full text-sm font-medium">
                        {form.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {form.subcategory}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{form.industry}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Created: {new Date(form.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {form.submission_count} submissions
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => copyFormUrl(form.form_id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                    >
                      Copy Link
                    </button>
                    <Link
                      href={`/admin/forms/${form.form_id}/submissions`}
                      className="px-4 py-2 bg-[#241C15] text-white rounded-lg hover:bg-[#241C15]/90 transition-all duration-200 text-sm font-medium text-center"
                    >
                      View Submissions ({form.submission_count})
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
