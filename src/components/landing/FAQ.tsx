'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ({ heading, items = [] }: { heading?: string; items?: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0) // open first by default

  return (
    <section className="relative bg-white py-24 text-[#241C15] overflow-hidden">
      {/* background accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5 }}
        className="absolute -right-32 top-0 w-[480px] h-[480px] rounded-full bg-[#FFE01B] blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.5 }}
        className="absolute -left-32 bottom-0 w-[380px] h-[380px] rounded-full bg-yellow-200 blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* heading */}
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#241C15] to-[#3b2d21] bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
        )}

        <div className="mt-14 grid md:grid-cols-2 gap-10">
          {/* FAQ accordion */}
          <div>
            {items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="mb-5 border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-left">
                    <div className="font-semibold text-lg">{it.question}</div>
                    <div className="text-xs text-gray-400 mt-1">Click to expand</div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 bg-white"
                    >
                      <p className="text-gray-600 leading-relaxed">{it.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Support card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md p-10 rounded-3xl bg-[#241C15] text-white shadow-lg relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#FFE01B] opacity-10 blur-2xl"
              />

              <HelpCircle className="w-10 h-10 text-[#FFE01B] mb-4" />
              <h3 className="text-2xl font-bold">Still have a question?</h3>
              <p className="mt-4 text-gray-300 leading-relaxed">
                Reach out to our team — we’ll get back within <span className="font-semibold text-white">1 business day</span>.
              </p>
              <div className="mt-6">
                <a
                  href="#contact"
                  className="inline-block bg-[#FFE01B] text-black px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-300 hover:shadow-lg transition-all"
                >
                  Contact us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
