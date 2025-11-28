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
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4 shadow-lg"
            style={{ 
              backgroundColor: '#FFE01B',
              borderColor: '#241C15'
            }}
          >
            <Lightbulb className="h-10 w-10" style={{ color: '#241C15' }} />
          </div>
        </motion.div>

        {/* Heading */}
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
          className="text-xl md:text-3xl text-center font-semibold mb-16"
          style={{ color: '#241C15', opacity: 0.8 }}
        >
          {subheading}
        </motion.h3>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
                  className="text-base md:text-lg leading-relaxed flex-1 pt-1"
                  style={{ color: '#241C15', opacity: 0.9 }}
                >
                  {solution}
                </p>
              </div>

              {/* Animated bottom accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="h-1 mt-4 rounded-full"
                style={{ 
                  backgroundColor: '#FFE01B',
                  transformOrigin: 'left'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Call-to-action badge at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-full border-2 shadow-lg"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#FFE01B'
            }}
          >
            <Sparkles className="h-5 w-5" style={{ color: '#FFE01B' }} />
            <span className="font-bold text-lg" style={{ color: '#241C15' }}>
              Transform Your Business Today
            </span>
            <Sparkles className="h-5 w-5" style={{ color: '#FFE01B' }} />
          </div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 left-[12%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-40 right-[15%] w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute top-1/2 right-[8%] w-2 h-2 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}