"use client"
import { motion } from "framer-motion"
import { AlertCircle, AlertTriangle, TrendingDown, XCircle } from "lucide-react"

interface TheProblemProps {
  heading: string
  subheading: string
  paragraph: string
}

export default function TheProblem({ heading, subheading, paragraph }: TheProblemProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Simplified background accents */}
      <div className="absolute -left-32 top-20 w-[300px] h-[300px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <div className="absolute -right-32 bottom-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Simplified decorative icons */}
      <div className="absolute left-[5%] top-32 hidden lg:block opacity-10">
        <AlertCircle className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </div>
      <div className="absolute right-[8%] top-40 hidden lg:block opacity-10">
        <TrendingDown className="h-10 w-10" style={{ color: '#FFE01B' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#fbf5e5] backdrop-blur border border-[#FFE01B]/20 shadow-lg"
          >
            <AlertTriangle className="w-4 h-4 text-[#241C15]/70" />
            <span className="text-sm font-semibold text-[#241C15]/70">
              THE PROBLEM
            </span>
          </motion.div>
        </div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-center mb-4 md:mb-6 leading-tight"
          style={{ color: '#241C15' }}
        >
          {heading}
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-1 mx-auto mb-6 md:mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
        />

        {/* Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl md:text-2xl text-center font-semibold mb-8 md:mb-12 px-4 text-[#241C15]/60"
        >
          {subheading}
        </motion.h3>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 md:p-8 lg:p-12 mx-2"
        >
          <p
            className="text-base sm:text-xl md:text-2xl/5 leading-relaxed text-center text-[#241C15]/60"
          >
            {paragraph}
          </p>
        </motion.div>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="h-1 mx-auto rounded-full mt-0"
          style={{
            backgroundColor: '#FFE01B',
            maxWidth: '200px',
            transformOrigin: 'center'
          }}
        />
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