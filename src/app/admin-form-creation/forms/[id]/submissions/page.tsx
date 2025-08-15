"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Form, FreelancerSubmission } from "../../../../../types/database"

interface SubmissionsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SubmissionsPage({ params }: SubmissionsPageProps) {
  const [form, setForm] = useState<Form | null>(null)
  const [submissions, setSubmissions] = useState<FreelancerSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formId, setFormId] = useState<string>("")

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setFormId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!formId) return
    console.log("Fetching data for form ID:", formId)
    const fetchData = async () => {
      try {
        const formResponse = await fetch("/api/forms")
        const formData = await formResponse.json()
        console.log("Form data fetched:", formData)
        if (!formResponse.ok) {
          throw new Error(formData.error || "Failed to fetch form")
        }
        
        const currentForm = formData.forms.find((f: Form) => f.form_id === formId)
        if (!currentForm) {
          throw new Error("Form not found")
        }
        setForm(currentForm)
        console.log("Current form set:", currentForm)
        const submissionsResponse = await fetch(`/api/submissions?form_id=${formId}`)
        const submissionsData = await submissionsResponse.json()

        if (!submissionsResponse.ok) {
          throw new Error(submissionsData.error || "Failed to fetch submissions")
        }

        setSubmissions(submissionsData.submissions || [])
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [formId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-300 text-lg">{error}</p>
          <Link
            href="/admin/dashboard"
            className="mt-4 inline-block bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Back to Dashboard
          </Link>
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
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/dashboard"
              className="text-[#FFE01B] hover:text-[#FCD34D] transition-colors duration-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{form?.form_name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-[#FFE01B] text-black px-3 py-1 rounded-full text-sm font-medium">{form?.category}</span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">{form?.subcategory}</span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">{form?.industry}</span>
          </div>
          <p className="text-gray-300">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} received
          </p>
        </motion.div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">No Submissions Yet</h3>
              <p className="text-gray-300 mb-6">Share your form link to start receiving applications.</p>
              <button
                onClick={() => {
                  const baseUrl = window.location.origin
                  const formUrl = `${baseUrl}/form/${formId}`
                  navigator.clipboard.writeText(formUrl)
                }}
                className="bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Copy Form Link
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{submission.name}</h3>
                    <p className="text-gray-600">{submission.email}</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 lg:mt-0">
                    Submitted: {new Date(submission.created_at).toLocaleDateString()}{" "}
                    {new Date(submission.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submission.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <p className="text-gray-900">{submission.phone}</p>
                    </div>
                  )}

                  {submission.years_experience && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Experience:</span>
                      <p className="text-gray-900">{submission.years_experience} years</p>
                    </div>
                  )}

                  {submission.portfolio_link && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Portfolio:</span>
                      <a
                        href={submission.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        View Portfolio
                      </a>
                    </div>
                  )}

                  {submission.github_link && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">GitHub:</span>
                      <a
                        href={submission.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        View GitHub
                      </a>
                    </div>
                  )}

                  {submission.resume_link && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Resume:</span>
                      <a
                        href={submission.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        View Resume
                      </a>
                    </div>
                  )}

                  {submission.proposal_link && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Proposal:</span>
                      <a
                        href={submission.proposal_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        View Proposal
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
