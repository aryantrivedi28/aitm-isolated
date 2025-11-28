"use client"
import { motion } from "framer-motion"
import { CheckCircle, Lightbulb, Sparkles, Zap } from "lucide-react"

interface TheSolutionProps {
  heading: string
  subheading: string
  solutions: string[]
}

export default function TheSolution({ heading, subheading, solutions }: TheSolutionProps) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -right-40 top-10 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute -left-40 bottom-20 w-[450px] h-[450px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Floating decorative icons */}
      <motion.div
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 0.12, rotate: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-[8%] top-24 hidden lg:block"
      >
        <Sparkles className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 20 }}
        animate={{ opacity: 0.12, rotate: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute right-[10%] bottom-32 hidden lg:block"
      >
        <Zap className="h-14 w-14" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#fbf5e5] backdrop-blur border border-[#FFE01B]/20 shadow-lg"
          >
            <Lightbulb className="w-4 h-4 text-[#241C15]/70" />
            <span className="text-sm font-semibold text-[#241C15]/70">
              THE SOLUTION
            </span>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4 md:mb-6 leading-tight w-[70%] justify-center mx-auto"
          style={{ color: '#241C15' }} // change this!
        >
          {heading}
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "140px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
        />

        {/* Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl sm:text-xl md:text-[26px] text-center font-medium mb-16 text-[#241C15]/60"
        >
          {subheading}
        </motion.h3>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-1 gap-6 max-w-4xl mx-auto">
          {solutions?.map((solution: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="rounded-xl p-6 border-2 shadow-md hover:shadow-xl transition-all duration-300 group"
              style={{
                backgroundColor: '#fbf5e5',
                borderColor: '#FFE01B'
              }}
            >
              <div className="flex items-start space-x-4">
                {/* Checkmark icon */}
                <div
                  className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{ backgroundColor: '#FFE01B' }}
                >
                  <CheckCircle
                    className="h-6 w-6"
                    style={{ color: '#241C15' }}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Solution text */}
                <p
                  className="text-base md:text-lg leading-relaxed flex-1 pt-1 font-semibold"
                  style={{ color: '#241C15', opacity: 0.9 }}
                >
                  {solution}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}