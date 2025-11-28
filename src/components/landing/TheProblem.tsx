"use client"
import { motion } from "framer-motion"
import { AlertCircle, TrendingDown, XCircle } from "lucide-react"

interface TheProblemProps {
  heading: string
  subheading: string
  paragraph: string
}

export default function TheProblem({ heading, subheading, paragraph }: TheProblemProps) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#fbf5e5' }}>
      {/* Background accents with your brand colors */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -left-32 top-20 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -right-32 bottom-20 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      
      {/* Decorative icons floating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-[10%] top-32 hidden lg:block"
      >
        <AlertCircle className="h-16 w-16" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute right-[12%] top-40 hidden lg:block"
      >
        <TrendingDown className="h-14 w-14" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#FFE01B'
            }}
          >
            <XCircle className="h-10 w-10" style={{ color: '#FFE01B' }} />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight"
          style={{ color: '#241C15' }}
        >
          {heading}
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "120px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
        />

        {/* Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-3xl text-center font-semibold mb-12"
          style={{ color: '#241C15', opacity: 0.8 }}
        >
          {subheading}
        </motion.h3>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 md:p-12 border-2 shadow-xl"
          style={{ borderColor: '#FFE01B' }}
        >
          <p 
            className="text-lg md:text-2xl leading-relaxed text-center"
            style={{ color: '#241C15', opacity: 0.85 }}
          >
            {paragraph}
          </p>

          {/* Accent quotes */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-between mt-8 px-4"
          >
            <div className="text-6xl font-serif opacity-20" style={{ color: '#FFE01B' }}>"</div>
            <div className="text-6xl font-serif opacity-20" style={{ color: '#FFE01B' }}>"</div>
          </motion.div>
        </motion.div>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-2 mt-12 mx-auto rounded-full"
          style={{ 
            backgroundColor: '#FFE01B',
            maxWidth: '300px',
            transformOrigin: 'center'
          }}
        />
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 left-[15%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-48 right-[20%] w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}