'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ({
  faqs = [],
}: {
  heading?: string
  faqs?: FAQItem[]
}) {
  const [open, setOpen] = useState<number | null>(null)

  // ✅ Add FAQ Schema Markup for Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  }

  return (
    <section className="relative bg-[#fbf5e5] py-12 md:py-20 text-[#241C15] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#241C15] text-[#fbf5e5] px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6 shadow-md">
            <Zap size={16} className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span>FAQs</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-3xl mx-auto leading-tight text-[#241C15]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#241C15]/65 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Find answers to common questions about our services and how we can help you succeed.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12">
          <div className="space-y-3 md:space-y-4">
            {faqs.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
                className="border border-[#241C15]/10 rounded-lg md:rounded-xl bg-white shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 bg-transparent transition-colors group"
                >
                  <div className="text-left flex-1">
                    <div className="font-semibold text-base md:text-lg text-[#241C15] group-hover:text-[#FFE01B] transition-colors">
                      {it.question}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all group-hover:bg-[#FFE01B]/20 group-hover:text-[#FFE01B] ${
                        open === i
                          ? 'bg-[#FFE01B]/20 text-[#FFE01B]'
                          : 'bg-[#241C15]/5 text-[#241C15]/60'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          open === i ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 md:px-6 md:pb-6">
                        <p className="text-[#241C15]/65 leading-relaxed text-sm md:text-base">
                          {it.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Inject structured FAQ schema for SEO */}
      {faqs?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </section>
  )
}
