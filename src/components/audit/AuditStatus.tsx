'use client'

import { motion } from 'framer-motion'

export default function AuditStatus() {
  const steps = [
    { id: 1, label: 'Crawling Store', description: 'Analyzing page structure and content' },
    { id: 2, label: 'Performance Audit', description: 'Checking load times and Core Web Vitals' },
    { id: 3, label: 'SEO Analysis', description: 'Reviewing meta tags and page optimization' },
    { id: 4, label: 'UX Evaluation', description: 'Testing user experience and navigation' },
    { id: 5, label: 'Conversion Review', description: 'Analyzing checkout and conversion paths' },
    { id: 6, label: 'Trust Assessment', description: 'Checking security and trust indicators' },
    { id: 7, label: 'AI Analysis', description: 'Generating expert recommendations' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Shopify Store</h1>
          <p className="text-gray-600">This usually takes 1-2 minutes. Please wait...</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{step.id}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 left-5 w-0.5 h-12 bg-blue-200" />
                  )}
                </div>
                <div className="ml-6">
                  <h3 className="font-semibold text-gray-900">{step.label}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                <div className="ml-auto">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className="w-3 h-3 rounded-full bg-blue-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '90%' }}
                transition={{ duration: 10, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Running deep analysis...
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Do not close this window. Results will appear here automatically.</p>
        </div>
      </div>
    </div>
  )
}