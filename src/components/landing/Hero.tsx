'use client'

import { ArrowRight, Zap, Sparkles, Star, ChevronRight, Play, Shield, Rocket, TrendingUp, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { urlFor } from "@/src/sanity/lib/image"
import { motion, AnimatePresence } from 'framer-motion'

interface CTA {
  label: string
  href: string
  variant?: string
}

interface Screenshot {
  image: any
  caption?: string
}

interface BlogButton {
  label: string
  href: string
}

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: any
  ctas?: CTA[]
  screenshots?: Screenshot[]
  blogButton?: BlogButton
}

export default function Hero({
  title,
  subtitle,
  ctas = [],
  screenshots = [],
  blogButton,
}: HeroProps) {
  const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number; size: number; type: string }[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    setIsVisible(true)

    // Enhanced particles with different types
    setParticles(
      Array.from({ length: isMobile ? 15 : 25 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 4,
        type: i % 4 === 0 ? 'circle' : i % 4 === 1 ? 'pulse' : i % 4 === 2 ? 'star' : 'sparkle'
      }))
    )

    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  // Prevent body scroll when form is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])

  // Form handlers
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
        setSubmitMessage('Form submitted successfully! We\'ll contact you within 24 hours.')

        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            business: '',
            website: '',
            interest: ''
          })
          setShowForm(false)
        }, 2000)
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if CTA label suggests it should open form
  const shouldOpenForm = (label: string) => {
    const formTriggers = [
      'contact', 'contact us', 'get in touch', 'get started',
      'free consultation', 'book a call', 'schedule a demo',
      'request a quote', 'get free demo', 'start project'
    ];

    return formTriggers.some(trigger =>
      label.toLowerCase().includes(trigger.toLowerCase())
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 224, 27, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 224, 27, 0.6), 0 0 60px rgba(255, 224, 27, 0.2); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-floatParticle { animation: floatParticle 4s ease-in-out infinite; }
        .animate-pulseGlow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-typewriter { animation: typewriter 3.5s steps(40, end); }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>

      <div className="hero-section relative bg-[] overflow-hidden">

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">

              {/* Left Column - Enhanced Text Content */}
              <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : ''}`}>
                {/* Title with enhanced gradient and effects */}
                <div className="space-y-4">
                  <h1 className="leading-[1.05] tracking-tight bg-[#241C15] bg-clip-text text-transparent relative"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      letterSpacing: '-0.03em',
                      fontWeight: '400',
                    }}
                  >
                    {title}
                  </h1>
                </div>

                {/* Subtitle with enhanced styling */}
                {subtitle && (
                  <div className="space-y-4">
                    <p className="text-[#241C15]/75 leading-relaxed font-medium text-lg md:text-xl max-w-2xl"
                      style={{
                        lineHeight: '1.75'
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>
                )}

                {/* Feature Points */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  {['No Setup Fees', '24/7 Support', '30-Day Guarantee', 'Easy Migration'].map((feature, index) => (
                    <div key={feature} className="flex items-center gap-2 text-[#241C15]/70 group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="w-5 h-5 bg-[#f7af00] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-1.5 h-1.5 bg-[#241C15] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced CTA Buttons */}
                {ctas?.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                    {/* {ctas.map((cta, index) => {
                      const isSecondary = cta.variant === "secondary";
                      const isFormTrigger = shouldOpenForm(cta.label);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (isFormTrigger) {
                              setShowForm(true);
                            } else if (cta.href) {
                              // If it's a regular link, navigate to it
                              window.location.href = cta.href;
                            }
                          }}
                          className={`group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                            isSecondary
                              ? "border-2 border-[#241C15]/20 text-[#241C15]/80 hover:text-[#241C15] hover:border-[#241C15]/40 hover:bg-[#241C15]/5 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl"
                              : "bg-[#f7af00] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-pulseGlow"
                          } animate-fadeIn`}
                          style={{ 
                            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                          <span className="relative z-10">{cta.label}</span>
                          {!isSecondary ? (
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      );
                    })} */}

                    {/* Add a simple button to always open the form (for testing) */}
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-[#f7af00] text-[#241C15] shadow-2xl hover:shadow-3xl hover:scale-[1.02] animate-fadeIn mt-4 sm:mt-0"
                      style={{ animationDelay: '0.4s' }}
                    >
                      <span>Join Us</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Enhanced Screenshots */}
              <div className={`relative ${isVisible ? 'animate-slideInRight' : ''}`}>

                {/* Main screenshot container with floating effect */}
                <div className="relative">
                  {/* Screenshots Grid */}
                  {screenshots?.length > 0 && (
                    <div className="relative space-y-6">
                      {screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="group relative w-full transform hover:scale-[1.02] transition-all duration-500"
                          style={{ animationDelay: `${index * 0.3}s` }}
                        >
                          {/* Card with enhanced styling */}
                          <div className="relative backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">

                            {/* Image container */}
                            <div className="aspect-video relative overflow-hidden">
                              {screenshot.image && (
                                <img
                                  src={urlFor(screenshot.image).url()}
                                  alt={screenshot.caption || `Screenshot ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal/Popup */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
              onClick={() => setShowForm(false)}
            />

            {/* Form Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="relative w-full max-w-7xl bg-[#f0eadd] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Form Content */}
                <div className="grid md:grid-cols-2">
                  {/* Left Column - Form */}
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#050504] mb-3">
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
                        className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${submitStatus === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                          }`}
                      >
                        {submitStatus === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium">{submitMessage}</p>
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-[#31302f] mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                            placeholder="Enter your full name"
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
                          <label htmlFor="email" className="block text-sm font-semibold text-[#31302f] mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                            placeholder="Enter your email address"
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
                          <label htmlFor="phone" className="block text-sm font-semibold text-[#31302f] mb-2">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50`}
                            placeholder="Enter your phone number"
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

                        {/* Website */}
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

                        {/* Interest */}
                        <div>
                          <label htmlFor="interest" className="block text-sm font-semibold text-[#31302f] mb-2">
                            Interested in <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.interest ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              } focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00] focus:ring-opacity-20 transition-all duration-200 bg-gray-50 appearance-none`}
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
                            <ArrowRight className="w-5 h-5" />
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
                  </div>

                  {/* Right Column - Info */}
                  <div className="bg-[#f0eadd] p-6 md:p-8 lg:p-10">
                    <div className="mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#050504] mb-3">
                        Why Connect With Us?
                      </h3>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-[#050504]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#050504] mb-2">Fast Response</h3>
                          <p className="text-[#31302f]">
                            Get a response from our experts within 24 hours of submitting your details.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-[#050504]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#050504] mb-2">Secure & Confidential</h3>
                          <p className="text-[#31302f]">
                            Your information is protected with enterprise-grade security.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-[#050504]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#050504] mb-2">Expert Consultation</h3>
                          <p className="text-[#31302f]">
                            Personalized advice from industry experts with 10+ years of experience.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-[#050504] mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-[#31302f]">
                          <Sparkles className="w-5 h-5 mr-3 text-[#f7af00]" />
                          <span>contact@businessexample.com</span>
                        </div>
                        <div className="flex items-center text-[#31302f]">
                          <Rocket className="w-5 h-5 mr-3 text-[#f7af00]" />
                          <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center text-[#31302f]">
                          <Star className="w-5 h-5 mr-3 text-[#f7af00]" />
                          <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Additional global styles */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }
      `}</style>
    </>
  )
}