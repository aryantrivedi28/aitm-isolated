"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../../lib/SupabaseAuthClient"
import type { Form } from "../../../types/database"
import { FileUpload } from "../../../components/file-upload"
import { useRouter } from "next/navigation"

interface FormPageProps {
  params: Promise<{
    id: string
  }>
}

export default function FormPage({ params }: FormPageProps) {
  const [formId, setFormId] = useState<string | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [customResponses, setCustomResponses] = useState<Record<string, any>>({})
  const router = useRouter()

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setFormId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  // Fetch form details
  useEffect(() => {
    if (!formId) return

    const fetchForm = async () => {
      try {
        const { data: allForms, error: listError } = await supabase.from("forms").select("*")

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formId)
        const queryField = isUUID ? "id" : "form_id"

        const { data, error } = await supabase.from("forms").select("*").eq(queryField, formId).single()

        if (error) {
          throw error
        }

        setForm(data)

        const initialData: Record<string, any> = {}
        data.required_fields?.forEach((field: string) => {
          initialData[field] = ""
        })
        setFormData(initialData)

        const initialCustomResponses: Record<string, any> = {}
        data.custom_questions?.forEach((question: any) => {
          if (question.type === "checkbox") {
            initialCustomResponses[question.id] = []
          } else {
            initialCustomResponses[question.id] = ""
          }
        })
        setCustomResponses(initialCustomResponses)
      } catch (err: any) {
        console.error("Error fetching form:", err)
        if (err.code === "PGRST116") {
          setError(`Form with ID "${formId}" not found. Please check the URL or contact the administrator.`)
        } else {
          setError("Form not found or no longer available")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const submissionData: Record<string, any> = {
        form_id: form?.id || formId,
        custom_responses: customResponses,
      }

      const standardFields = [
        "name",
        "email",
        "phone",
        "portfolio_link",
        "github_link",
        "resume_link",
        "years_experience",
        "proposal_link",
      ]

      standardFields.forEach((field: string) => {
        if (field === "years_experience") {
          submissionData[field] = formData[field] ? Number(formData[field]) : null
        } else {
          submissionData[field] = formData[field] || null
        }
      })

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setSubmitted(true)

      // ✅ Redirect to freelancer dashboard after success
      setTimeout(() => {
        router.push("/get-hired/freelancer/dashboard")
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomResponseChange = (questionId: string, value: any, type: string) => {
    setCustomResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const getFieldLabel = (fieldKey: string): string => {
    const fieldLabels: Record<string, string> = {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      portfolio_link: "Portfolio URL",
      github_link: "GitHub Profile",
      resume_link: "Resume",
      years_experience: "Years of Experience",
      proposal_link: "Proposal/Cover Letter",
    }
    return fieldLabels[fieldKey] || fieldKey
  }

  const renderCustomQuestion = (question: any) => {
    const { id, type, label, required, options } = question

    switch (type) {
      case "text":
        return (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={required}
              value={customResponses[id] || ""}
              onChange={(e) => handleCustomResponseChange(id, e.target.value, type)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              required={required}
              value={customResponses[id] || ""}
              onChange={(e) => handleCustomResponseChange(id, e.target.value, type)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        )

      case "select":
        return (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
              required={required}
              value={customResponses[id] || ""}
              onChange={(e) => handleCustomResponseChange(id, e.target.value, type)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
            >
              <option value="">Select an option</option>
              {options?.map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case "radio":
        return (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={id}
                    value={option}
                    checked={customResponses[id] === option}
                    onChange={(e) => handleCustomResponseChange(id, e.target.value, type)}
                    className="mr-2 text-[#FFE01B] focus:ring-[#FFE01B]"
                    required={required}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(customResponses[id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = customResponses[id] || []
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option)
                      handleCustomResponseChange(id, newValues, type)
                    }}
                    className="mr-2 text-[#FFE01B] focus:ring-[#FFE01B]"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <div className="text-white text-xl">Loading form...</div>
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Form Not Found</h1>
          <p className="text-gray-300 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (form && !form.is_active) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Form Closed</h1>
          <p className="text-gray-300 text-lg">This form is currently not accepting submissions.</p>
        </div>
      </div>
    )
  }

  // if (submitted) {
  //   return (
  //     <div className="min-h-screen bg-[#241C15] flex items-center justify-center px-4">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.9 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.6 }}
  //         className="text-center bg-white rounded-lg p-8 max-w-md mx-auto"
  //       >
  //         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //           </svg>
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
  //         <p className="text-gray-600 mb-6">
  //           Thank you for your interest. We'll review your application and get back to you soon.
  //         </p>
  //       </motion.div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-[#241C15] py-12 px-4 pt-[80px] sm:pt-[100px] lg:pt-[130px]">
      <div className="max-w-3xl mx-auto">
        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{form?.form_name}</h1>
          <p
            className="text-gray-300 mb-6"
            dangerouslySetInnerHTML={{
              __html: (form?.form_description || "No description provided.").replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">$1</a>',
              ),
            }}
          />

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-[#FFE01B] text-black px-3 py-1 rounded-full font-medium">{form?.category}</span>
            {form?.subcategory && (
              <span className="bg-white/10 text-white px-3 py-1 rounded-full">{form.subcategory}</span>
            )}
            <span className="bg-white/10 text-white px-3 py-1 rounded-full">{form?.industry}</span>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Application</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form?.required_fields?.map((fieldKey: string) => {
              const label = getFieldLabel(fieldKey)
              const isRequired = true

              if (fieldKey === "resume_link") {
                return (
                  <FileUpload
                    key={fieldKey}
                    label="Resume"
                    required={isRequired}
                    accept=".pdf,.doc,.docx"
                    maxSize={5}
                    onUploadComplete={(url) => handleInputChange(fieldKey, url)}
                    currentFile={formData[fieldKey]}
                  />
                )
              }

              if (fieldKey === "proposal_link") {
                return (
                  <FileUpload
                    key={fieldKey}
                    label="Proposal/Cover Letter"
                    required={isRequired}
                    accept=".pdf,.doc,.docx"
                    maxSize={5}
                    onUploadComplete={(url) => handleInputChange(fieldKey, url)}
                    currentFile={formData[fieldKey]}
                  />
                )
              }

              if (fieldKey === "years_experience") {
                return (
                  <div key={fieldKey}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required={isRequired}
                      value={formData[fieldKey] || ""}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 3"
                    />
                  </div>
                )
              }

              const inputType =
                fieldKey === "email"
                  ? "email"
                  : fieldKey.includes("link")
                    ? "url"
                    : fieldKey === "phone"
                      ? "tel"
                      : "text"

              return (
                <div key={fieldKey}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {isRequired && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={inputType}
                    required={isRequired}
                    value={formData[fieldKey] || ""}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
                    placeholder={
                      fieldKey === "name"
                        ? "Enter your full name"
                        : fieldKey === "email"
                          ? "your.email@example.com"
                          : fieldKey === "phone"
                            ? "1234567890"
                            : fieldKey.includes("link")
                              ? `https://your${fieldKey.replace("_link", "")}.com`
                              : `Enter your ${label.toLowerCase()}`
                    }
                  />
                </div>
              )
            })}

            {form?.custom_questions?.map((question: any) => renderCustomQuestion(question))}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting Application..." : "Submit Application"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
