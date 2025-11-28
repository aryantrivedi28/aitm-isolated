"use client"
import { motion } from "framer-motion"
import { Check, Package, Sparkles, Star, Gift } from "lucide-react"

interface IncludesSectionProps {
  heading: string
  subheading?: string
  items: string[]
}

export default function IncludesSection({ heading, subheading, items }: IncludesSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#241C15' }}>
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -left-40 top-20 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute -right-40 bottom-20 w-[550px] h-[550px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Diagonal stripes pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #FFE01B,
            #FFE01B 2px,
            transparent 2px,
            transparent 20px
          )`
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 10, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-[10%] hidden lg:block"
      >
        <Package className="h-14 w-14" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-[8%] hidden lg:block"
      >
        <Gift className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 150 }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4 shadow-2xl"
            style={{ 
              backgroundColor: '#FFE01B',
              borderColor: '#FFE01B'
            }}
          >
            <Package className="h-10 w-10" style={{ color: '#241C15' }} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#FFE01B' }}>
            {heading}
          </h2>
        </motion.div>

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
            style={{ color: '#fbf5e5', opacity: 0.9 }}
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
                style={{ color: '#fbf5e5' }}
              >
                {item}
              </span>

              {/* Hover indicator */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 ml-2"
              >
                <Star className="h-5 w-5" style={{ color: '#FFE01B' }} fill="#FFE01B" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        {items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div 
              className="inline-block rounded-2xl p-8 border-2 shadow-2xl backdrop-blur-sm max-w-3xl"
              style={{ 
                backgroundColor: 'rgba(255, 224, 27, 0.15)',
                borderColor: '#FFE01B'
              }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6" style={{ color: '#FFE01B' }} />
                <Sparkles className="h-8 w-8" style={{ color: '#FFE01B' }} />
                <Sparkles className="h-6 w-6" style={{ color: '#FFE01B' }} />
              </div>
              <p className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#FFE01B' }}>
                All This & More Included
              </p>
              <p className="text-base md:text-lg" style={{ color: '#fbf5e5', opacity: 0.9 }}>
                In our comprehensive package with no hidden fees
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-[12%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-1/3 right-[15%] w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
        className="absolute top-2/3 right-[8%] w-2 h-2 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}