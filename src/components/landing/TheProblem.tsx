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
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#f0eadd]">

      <div className="relative z-10 max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-center mb-2 md:mb-4 leading-tight w-[90%] justify-center mx-auto"
          style={{ color: '#241C15' }} // change this!
        >
          {heading}
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "180px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-1 mx-auto mb-6 md:mb-8 rounded-full"
          style={{ backgroundColor: '#f7af00' }}
        />

        {/* Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl md:text-xl text-center font-medium mb-4 md:mb-6 px-4 text-[#31302f]"
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
            className="text-base sm:text-xl md:text-2xl/5 leading-relaxed text-center text-[#31302f]/60 font-medium"
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
            backgroundColor: '#f7af00',
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