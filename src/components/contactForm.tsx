'use client'

import { useState } from 'react'
import { Send, Loader2, Check, AlertTriangle } from 'lucide-react'
import Notification from './Notification'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    website: '',
    interest: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationState | null>(null)

  interface FormData {
    name: string
    email: string
    phone: string
    business: string
    website: string
    interest: string
  }

  interface FormErrors {
    [key: string]: string
  }

  interface NotificationState {
    message: string
    type: 'success' | 'error'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [id]: value }))

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev: FormErrors) => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.interest) newErrors.interest = 'Please select an interest'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      setNotification({
        message: 'Please fix the errors in the form',
        type: 'error'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: { error?: string } = await response.json()

      if (response.ok) {
        setNotification({
          message: 'Form submitted successfully! We\'ll contact you soon.',
          type: 'success'
        })

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          business: '',
          website: '',
          interest: ''
        })
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setNotification({
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="min-h-screen bg-[#faf4e5] flex items-center justify-center p-4">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Form Section */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-[#050504] mb-3 pb-3 relative">
                  Need to Discuss Requirements?
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#f7af00] rounded-full"></span>
                </h1>
                <p className="text-[#31302f] text-lg">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="business" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Your Business Name
                    </label>
                    <input
                      type="text"
                      id="business"
                      value={formData.business}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50"
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Web URL
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-semibold text-[#31302f] mb-2">
                      Interested in <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${errors.interest ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50 appearance-none`}
                    >
                      <option value="">Select an option</option>
                      <option value="Web Development">GHL VA</option>
                      <option value="Mobile App">One Time Project</option>
                      <option value="Digital Marketing">On Going Support</option>
                    </select>
                    {errors.interest && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.interest}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-[#f7af00] text-[#050504] font-bold rounded-lg hover:bg-[#e09e00] transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit
                    </>
                  )}
                </button>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-[#31302f] text-center">
                    We respect your privacy. Your information will not be shared with third parties.
                  </p>
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 bg-[#f0eadd] p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#050504] mb-8 pb-3 relative">
                Why Connect With Us?
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#f7af00] rounded-full"></span>
              </h2>

              <div className="space-y-8 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#050504]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#050504] mb-2">Expert Consultation</h3>
                    <p className="text-[#31302f]">
                      Get personalized advice from industry experts with over 10 years of experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#050504]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#050504] mb-2">Fast Response Time</h3>
                    <p className="text-[#31302f]">
                      We guarantee a response within 24 hours after submitting your requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#050504]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#050504] mb-2">Secure & Confidential</h3>
                    <p className="text-[#31302f]">
                      Your business information is protected with enterprise-grade security.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#050504] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-[#31302f]">
                    <svg className="w-5 h-5 mr-3 text-[#f7af00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>contact@businessexample.com</span>
                  </div>
                  <div className="flex items-center text-[#31302f]">
                    <svg className="w-5 h-5 mr-3 text-[#f7af00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-[#31302f]">
                    <svg className="w-5 h-5 mr-3 text-[#f7af00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}