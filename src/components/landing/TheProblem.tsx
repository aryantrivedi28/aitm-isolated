"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { AlertCircle, AlertTriangle, TrendingDown, XCircle, Send, Loader2, CheckCircle2 } from "lucide-react"

interface TheProblemProps {
  heading: string
  subheading: string
  paragraph: string
}

export default function TheProblem({ heading, subheading, paragraph }: TheProblemProps) {
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
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      setSubmitMessage('Please fix the errors in the form')
      setTimeout(() => setSubmitStatus(null), 5000)
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Form submitted successfully! We\'ll contact you soon.')
        
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
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }
  
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#f0eadd]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-2 md:mb-4 leading-tight mt-20"
              style={{ color: '#241C15' }}
            >
              {heading}
            </motion.h2>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "180px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-1 mb-6 md:mb-8 rounded-full"
              style={{ backgroundColor: '#f7af00' }}
            />

            {/* Subheading */}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-xl font-medium mb-4 md:mb-6 text-[#31302f]"
            >
              {subheading}
            </motion.h3>

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-base sm:text-xl md:text-2xl/5 leading-relaxed text-[#31302f]/60 font-medium">
                {paragraph}
              </p>
            </motion.div>

            {/* Bottom accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="h-1 rounded-full"
              style={{
                backgroundColor: '#f7af00',
                maxWidth: '200px',
                transformOrigin: 'left'
              }}
            />
          </motion.div>

          {/* Right Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#f0eadd] rounded-2xl p-6 md:p-8 lg:p-10"
          >
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-medium text-[#050504] mb-3">
                Get Your Free Consultation
              </h3>
              <p className="text-[#31302f]">
                Fill out this form and our experts will contact you within 24 hours.
              </p>
            </div>

            {/* Status Message */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{submitMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div className="">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-sm border-2 ${
                      errors.name ? 'border-red-300 bg-[#fbf5e5]' : 'border-gray-200'
                    } transition-all duration-200 bg-[#fbf5e5]`}
                    placeholder="Name*"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-sm border-2 ${
                      errors.email ? 'border-red-300 bg-[#fbf5e5]' : 'border-gray-200'
                    } transition-all duration-200 bg-[#fbf5e5]`}
                    placeholder="Email*"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-sm border-2 ${
                      errors.phone ? 'border-red-300 bg-[#fbf5e5]' : 'border-gray-200'
                    } transition-all duration-200 bg-[#fbf5e5]`}
                    placeholder="Phone*"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <input
                    type="text"
                    id="business"
                    value={formData.business}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border-2 border-gray-200 transition-all duration-200 bg-[#fbf5e5]"
                    placeholder="Your Business Name"
                  />
                </div>

                {/* Website */}
                <div>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm border-2 border-gray-200 focus:ring-2 transition-all duration-200 bg-[#fbf5e5]"
                    placeholder="Web URL"
                  />
                </div>

                {/* Interest */}
                <div className="md:col-span-2">
                  <select
                    id="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-sm border-2 ${
                      errors.interest ? 'border-red-300 bg-[#fbf5e5]' : 'border-gray-200'
                    } transition-all duration-200 bg-[#fbf5e5] appearance-none`}
                  >
                    <option value="">Interested In</option>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#f7af00] text-[#050504] font-bold rounded-lg hover:bg-[#e09e00] transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Now
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-[#31302f] text-center">
                  We respect your privacy. Your information will not be shared with third parties.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Simplified particles */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 left-[10%] w-2 h-2 rounded-full hidden lg:block opacity-30"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute top-48 right-[15%] w-2 h-2 rounded-full hidden lg:block opacity-30"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}