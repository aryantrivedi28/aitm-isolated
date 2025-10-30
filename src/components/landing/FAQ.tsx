'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle, Mail, Clock, Zap } from 'lucide-react'

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

  return (
    <section className="relative bg-[#fbf5e5] py-12 md:py-20 text-[#241C15] overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1.5 }}
          className="absolute -right-20 top-0 w-64 h-64 rounded-full bg-[#FFE01B] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1.5 }}
          className="absolute -left-20 bottom-0 w-56 h-56 rounded-full bg-[#FFE01B] blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#FFE01B] text-[#241C15] px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6 shadow-md">
            <Zap size={16} />
            <span>Frequently Asked Questions</span> {/* static */}
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-3xl mx-auto leading-tight text-[#241C15]">
            Frequently Asked Questions {/* static */}
          </h2>
          <p className="text-[#241C15]/65 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Find answers to common questions about our services and how we can help you succeed.
          </p>
        </motion.div>


        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12">
          {/* FAQ accordion */}
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
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all group-hover:bg-[#FFE01B]/20 group-hover:text-[#FFE01B] ${open === i
                          ? 'bg-[#FFE01B]/20 text-[#FFE01B]'
                          : 'bg-[#241C15]/5 text-[#241C15]/60'
                        }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${open === i ? 'rotate-180' : ''
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

          {/* Support card */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center mt-6 lg:mt-0"
          >
            <div className="w-full max-w-md p-6 md:p-8 rounded-xl bg-white text-[#241C15] shadow-lg border border-[#241C15]/10 relative overflow-hidden">
              {/* Background subtle accents *
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#FFE01B] opacity-10 blur-lg" />
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-[#FFE01B] opacity-10 blur-lg" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFE01B] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-[#241C15]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Still have questions?</h3>
                </div>

                <p className="text-[#241C15]/65 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                  Our support team is here to help you with any questions you might have. We typically respond within hours.
                </p>

                <div className="space-y-3 mb-6 md:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FFE01B]/15 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#FFE01B]" />
                    </div>
                    <span className="text-xs md:text-sm text-[#241C15]/65">
                      Response time:{' '}
                      <span className="font-semibold text-[#241C15]">Under 24 hours</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FFE01B]/15 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[#FFE01B]" />
                    </div>
                    <span className="text-xs md:text-sm text-[#241C15]/65">
                      Support: <span className="font-semibold text-[#241C15]">Email & Live Chat</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="#contact"
                    className="bg-[#FFE01B] text-[#241C15] px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-center shadow-md hover:bg-[#f5d000] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Mail size={16} className="md:w-5 md:h-5" />
                    Contact us
                  </a>
                  <a
                    href="#chat"
                    className="border border-[#FFE01B] text-[#FFE01B] px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium text-center hover:bg-[#FFE01B] hover:text-[#241C15] transition-all text-sm md:text-base"
                  >
                    Live Chat
                  </a>
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>

        {/* Additional info */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[#241C15]/10"
        >
          <p className="text-[#241C15]/60 text-xs md:text-sm">
            Can't find what you're looking for? Check our{' '}
            <a href="/help" className="text-[#FFE01B] hover:text-[#f5d000] font-semibold">
              help center
            </a>{' '}
            or{' '}
            <a href="/docs" className="text-[#FFE01B] hover:text-[#f5d000] font-semibold">
              documentation
            </a>
            .
          </p>
        </motion.div> */}
      </div>
    </section>
  )
}