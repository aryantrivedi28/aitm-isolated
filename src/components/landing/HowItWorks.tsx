'use client'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'

interface Step {
  title: string
  description: string
  highlight?: string
}
interface HowItWorksProps {
  heading: string
  steps?: Step[]
}

export default function HowItWorks({ heading, steps = [] }: HowItWorksProps) {
  return (
    <section className="relative bg-gray-50 py-12 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#fbf5e5] backdrop-blur border border-[#FFE01B]/20 shadow-lg"
          >
            <Briefcase className="w-4 h-4 text-[#241C15]/70" />
            <span className="text-sm font-semibold text-[#241C15]/70">
              HOW IT WORKS
            </span>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#241C15] to-[#4b3828] bg-clip-text text-transparent px-4"
        >
          {heading}
        </motion.h2>

        <div className="mt-12 md:mt-16 relative">
          {/* Vertical timeline line - Hidden on mobile, visible on tablet+ */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-[#FFE01B]/40 to-transparent transform md:-translate-x-1/2 hidden sm:block" />

          <div className="space-y-12 md:space-y-20">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE01B] font-bold text-black shadow-md z-10">
                        {i + 1}
                      </div>
                      {i !== steps.length - 1 && (
                        <div className="w-0.5 h-full bg-[#FFE01B]/40 mt-2 flex-1" />
                      )}
                    </div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.08 * i }}
                      className="flex-1 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all mb-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {s.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {s.description}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Tablet & Desktop Layout */}
                <div className="hidden sm:block relative">
                  <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                    i % 2 === 0 ? '' : 'md:flex-row-reverse'
                  }`}>
                    {/* Step content */}
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.08 * i }}
                      className="md:w-1/2 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 6 }}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[#FFE01B] font-bold text-black shadow-md"
                        >
                          {i + 1}
                        </motion.div>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-3 md:mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                        {s.description}
                      </p>
                    </motion.div>

                    {/* Spacer for desktop layout */}
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}