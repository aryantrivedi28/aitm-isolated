"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

interface FormData {
  categories: string
  form_id: string
  name: string
  phone_num: string
  email: string
  resume: string
  portfolio: string
  github: string
  proposal: string
  industry: string
}

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Content Writing",
  "Digital Marketing",
  "Data Analysis",
  "Graphic Design",
  "Video Editing",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Entertainment",
  "Real Estate",
  "Manufacturing",
]

export default function GigForm() {
  const [formData, setFormData] = useState<FormData>({
    categories: "",
    form_id: "gig_form_2024", // Updated form_id to match gig form naming
    name: "",
    phone_num: "",
    email: "",
    resume: "",
    portfolio: "",
    github: "",
    proposal: "",
    industry: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/submit-gig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          categories: "",
          form_id: "gig_form_2024",
          name: "",
          phone_num: "",
          email: "",
          resume: "",
          portfolio: "",
          github: "",
          proposal: "",
          industry: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <main className="min-h-screen bg-[#241C15]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4 animate-slide-down">Gig Form</h1>
            <p className="text-gray-300 text-lg animate-slide-up">
              Submit your gig application and join our network of talented professionals.
            </p>
          </div>
          <motion.div
            className="bg-white shadow-xl rounded-lg overflow-hidden max-w-xl mx-auto mt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="px-6 py-4 border-b border-gray-200" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-black">Gig Form</h2> {/* Changed from Application Form to Gig Form */}
            </motion.div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="name" className="block text-black font-medium">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="Enter your full name"
                  />
                </motion.div>

                {/* Email */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="email" className="block text-black font-medium">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="phone" className="block text-black font-medium">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone_num}
                    onChange={(e) => handleInputChange("phone_num", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </motion.div>

                {/* Category */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="category" className="block text-black font-medium">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.categories}
                    onChange={(e) => handleInputChange("categories", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                  >
                    <option value="">Select your expertise</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Industry */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="industry" className="block text-black font-medium">
                    Preferred Industry *
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                  >
                    <option value="">Select preferred industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Resume URL */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="resume" className="block text-black font-medium">
                    Resume URL
                  </label>
                  <input
                    id="resume"
                    type="url"
                    value={formData.resume}
                    onChange={(e) => handleInputChange("resume", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="https://drive.google.com/your-resume"
                  />
                </motion.div>

                {/* Portfolio URL */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="portfolio" className="block text-black font-medium">
                    Portfolio URL
                  </label>
                  <input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </motion.div>

                {/* GitHub URL */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="github" className="block text-black font-medium">
                    GitHub Profile
                  </label>
                  <input
                    id="github"
                    type="url"
                    value={formData.github}
                    onChange={(e) => handleInputChange("github", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </motion.div>

                {/* Proposal */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="proposal" className="block text-black font-medium">
                    Proposal
                  </label>
                  <textarea
                    id="proposal"
                    value={formData.proposal}
                    onChange={(e) => handleInputChange("proposal", e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] transition-all resize-vertical"
                    placeholder="Tell us about your experience, skills, and what makes you unique..."
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFE01B] hover:bg-[#FCD34D] text-black font-semibold py-3 px-4 rounded-md text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Gig Form" // Updated button text to match gig form
                  )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    className="p-4 bg-green-50 border border-green-200 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-green-800 font-medium">
                      ✅ Gig form submitted successfully! We'll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    className="p-4 bg-red-50 border border-red-200 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-red-800 font-medium">
                      ❌ There was an error submitting your gig form. Please try again.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>

  )
}
