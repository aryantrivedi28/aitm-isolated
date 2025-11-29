"use client"
import { motion } from "framer-motion"
import { Check, Package, Sparkles, Star, Gift, HandHeart } from "lucide-react"

interface IncludesSectionProps {
  heading: string
  subheading?: string
  items: string[]
}

export default function IncludesSection({ heading, subheading, items }: IncludesSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#fbf5e5] backdrop-blur border border-[#FFE01B]/20 shadow-lg"
          >
            <HandHeart className="w-4 h-4 text-[#241C15]/70" />
            <span className="text-sm font-semibold text-[#241C15]/70">
              INCLUDES
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
          whileInView={{ width: "200px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
        />

        {/* Subheading */}
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-center max-w-3xl mx-auto mb-16"
            style={{ color: '#FFE01B', opacity: 0.9 }}
          >
            {subheading}
          </motion.p>
        )}

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
          {items?.map((item: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.03, x: 5 }}
              className="flex items-center p-5 rounded-xl backdrop-blur-sm border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              style={{
                backgroundColor: 'rgba(255, 224, 27, 0.1)',
                borderColor: '#FFE01B'
              }}
            >
              {/* Checkmark icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{ backgroundColor: '#FFE01B' }}
              >
                <Check className="h-6 w-6" style={{ color: '#241C15' }} strokeWidth={3} />
              </div>

              {/* Item text */}
              <span
                className="text-base md:text-lg font-semibold flex-1"
                style={{ color: '#241C15' }}
              >
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}