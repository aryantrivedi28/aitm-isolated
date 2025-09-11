'use client'
import { motion } from 'framer-motion'

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
    <section className="relative bg-gray-50 py-24 overflow-hidden">
      {/* background accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.2 }}
        className="absolute -left-20 top-10 w-[360px] h-[360px] bg-[#FFE01B] rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.2 }}
        className="absolute -right-32 bottom-0 w-[420px] h-[420px] bg-yellow-200 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#241C15] to-[#4b3828] bg-clip-text text-transparent"
        >
          {heading}
        </motion.h2>

        <div className="mt-16 relative">
          {/* vertical timeline line */}
          <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFE01B]/40 to-transparent transform -translate-x-1/2" />

          <div className="space-y-20">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row items-center gap-10 ${
                    isLeft ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* step content */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.08 * i }}
                    className="md:w-1/2 bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 6 }}
                        className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FFE01B] font-bold text-black shadow-md"
                      >
                        {i + 1}
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-semibold">{s.title}</h3>
                    </div>
                    <p className="mt-4 text-gray-600 leading-relaxed">{s.description}</p>
                    {s.highlight && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 inline-block bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-[#241C15] shadow-sm"
                      >
                        {s.highlight}
                      </motion.span>
                    )}
                  </motion.div>

                  {/* illustration */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.12 * i }}
                    className="md:w-1/2 text-center"
                  >
                    <div className="bg-gradient-to-br from-[#FFE01B]/70 to-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all">
                      <div className="h-44 md:h-56 flex items-center justify-center text-2xl font-semibold text-black/60">
                        Visual — Step {i + 1}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
