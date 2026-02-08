'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Color Palette
const colors = {
  primary: '#f7af00',      // Gold
  light: '#faf4e5',        // Light cream
  lighter: '#f0eadd',      // Lighter cream
  dark: '#050504',         // Near black
  gray: '#31302f',         // Dark gray
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    storeUrl: '',
    name: ''
  })
  const [error, setError] = useState('')

  function getUserFriendlyError(error: any): string {
    if (!error) return 'Something went wrong. Please try again.'

    switch (error.code) {
      case 'NOT_SHOPIFY':
        return 'This website is not built on Shopify. Please enter a public Shopify store URL.'

      case 'CRAWL_FAILED':
        return 'We couldn’t access this website. It may be blocking automated scans.'

      case 'PERFORMANCE_TIMEOUT':
        return 'The website took too long to respond. Please try again later.'

      case 'AI_FAILED':
        return 'Analysis failed while generating insights. Please retry.'

      default:
        return error.message || 'Audit failed. Please try again.'
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/audit-tools/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!data.success) {
        const message = getUserFriendlyError(data.error)
        setError(message)
        setLoading(false)
        return
      }


      const auditId = data.auditId
      pollAuditStatus(auditId)

    } catch (err: any) {
      setError(err.message || 'Network error')
      setLoading(false)
    }
  }

  const pollAuditStatus = (auditId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit-tools/audit/${auditId}`)
        const result = await res.json()

        if (result.status === 'completed') {
          clearInterval(interval)
          router.push(`/audit/${auditId}`)
        }

        if (result.status === 'failed') {
          clearInterval(interval)
          setError(
            getUserFriendlyError(result.error) ||
            'Audit could not be completed.'
          )
          setLoading(false)
        }

      } catch {
        clearInterval(interval)
        setError('Something went wrong')
        setLoading(false)
      }
    }, 2500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.light }}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-4 sm:mb-6 leading-tight"
            style={{ color: colors.dark }}
          >
            Advanced Shopify Store Audit
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ color: colors.gray }}
          >
            Get a comprehensive, AI-powered analysis of your Shopify store's performance,
            UX, SEO, and conversion opportunities.
          </p>
        </motion.div>


        {/* Audit Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto px-0"
        >
          <div
            className="rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border"
            style={{
              backgroundColor: colors.lighter,
              borderColor: colors.lighter,
            }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border"
                style={{
                  backgroundColor: '#fee2e2',
                  borderColor: '#fecaca',
                }}
              >
                <p
                  className="text-sm sm:text-base font-medium"
                  style={{ color: '#991b1b' }}
                >
                  {error}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.dark }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 transition-all border"
                  placeholder="John Doe"
                  style={{
                    backgroundColor: colors.light,
                    color: colors.dark,
                    borderColor: colors.gray,
                    borderWidth: '1px',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 3px rgba(247, 175, 0, 0.1)`
                    e.target.style.borderColor = colors.primary
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none'
                    e.target.style.borderColor = colors.gray
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.dark }}
                >
                  Email Address <span style={{ color: colors.primary }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 transition-all border"
                  placeholder="you@business.com"
                  style={{
                    backgroundColor: colors.light,
                    color: colors.dark,
                    borderColor: colors.gray,
                    borderWidth: '1px',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 3px rgba(247, 175, 0, 0.1)`
                    e.target.style.borderColor = colors.primary
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none'
                    e.target.style.borderColor = colors.gray
                  }}
                />
                <p
                  className="mt-1 text-xs sm:text-sm"
                  style={{ color: colors.gray }}
                >
                  We'll send the detailed audit report to this email
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.dark }}
                >
                  Shopify Store URL <span style={{ color: colors.primary }}>*</span>
                </label>
                <input
                  type="url"
                  name="storeUrl"
                  required
                  value={formData.storeUrl}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 transition-all border"
                  placeholder="https://your-store.myshopify.com"
                  style={{
                    backgroundColor: colors.light,
                    color: colors.dark,
                    borderColor: colors.gray,
                    borderWidth: '1px',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 3px rgba(247, 175, 0, 0.1)`
                    e.target.style.borderColor = colors.primary
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none'
                    e.target.style.borderColor = colors.gray
                  }}
                />
                <p
                  className="mt-1 text-xs sm:text-sm"
                  style={{ color: colors.gray }}
                >
                  Must be a public Shopify store
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.dark,
                }}
              >
                {loading ? 'Analyzing...' : 'Start Free Audit'}
              </button>
            </form>

            {/* What You'll Get Section */}
            <div
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t"
              style={{ borderColor: colors.light }}
            >
              <h3
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                style={{ color: colors.dark }}
              >
                ✨ What You'll Get:
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 text-lg sm:text-xl font-bold mt-0.5"
                    style={{ color: colors.primary }}
                  >
                    ✓
                  </span>
                  <span style={{ color: colors.gray }}>
                    Complete performance analysis with Lighthouse metrics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 text-lg sm:text-xl font-bold mt-0.5"
                    style={{ color: colors.primary }}
                  >
                    ✓
                  </span>
                  <span style={{ color: colors.gray }}>
                    AI-powered recommendations and priority actions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 text-lg sm:text-xl font-bold mt-0.5"
                    style={{ color: colors.primary }}
                  >
                    ✓
                  </span>
                  <span style={{ color: colors.gray }}>
                    Detailed technical issues with step-by-step fixes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 text-lg sm:text-xl font-bold mt-0.5"
                    style={{ color: colors.primary }}
                  >
                    ✓
                  </span>
                  <span style={{ color: colors.gray }}>
                    Email report with all findings and estimated business impact
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Loading Modal */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl border"
              style={{
                backgroundColor: colors.light,
                borderColor: colors.lighter,
              }}
            >
              <div
                className="animate-spin h-10 sm:h-12 w-10 sm:w-12 rounded-full border-4 border-gray-300 mx-auto mb-4"
                style={{ borderTopColor: colors.primary }}
              />
              <p
                className="font-bold text-base sm:text-lg mb-2"
                style={{ color: colors.dark }}
              >
                Analyzing your store...
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: colors.gray }}
              >
                This may take 2-3 minutes
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Features Section */}
        <div
          className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {[
            {
              icon: '⚡',
              title: 'Deep Performance Analysis',
              description: 'Lighthouse metrics, Core Web Vitals, image optimization, script analysis'
            },
            {
              icon: '🎯',
              title: 'AI-Powered Insights',
              description: 'OpenAI analyzes your store and provides expert recommendations'
            },
            {
              icon: '🛠️',
              title: 'Actionable Solutions',
              description: 'Step-by-step fixes with code examples and implementation guides'
            }
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
              className="rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border hover:shadow-md transition-all"
              style={{
                backgroundColor: colors.lighter,
                borderColor: colors.lighter,
              }}
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 h-10 sm:h-12">
                {feature.icon}
              </div>
              <h3
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3"
                style={{ color: colors.dark }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: colors.gray }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 sm:mt-14 md:mt-16 text-center py-8 sm:py-10 md:py-12 px-4 rounded-xl sm:rounded-2xl border"
          style={{
            backgroundColor: colors.lighter,
            borderColor: colors.lighter,
          }}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: colors.dark }}
          >
            Ready to optimize your store?
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8"
            style={{ color: colors.gray }}
          >
            Get actionable insights in minutes, not hours
          </p>
          <button
            onClick={() => {
              const formSection = document.querySelector('form')
              formSection?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-block font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] text-base sm:text-lg"
            style={{
              backgroundColor: colors.primary,
              color: colors.dark,
            }}
          >
            Start Your Free Audit Now
          </button>
        </motion.div>
      </div>
    </div>
  )
}