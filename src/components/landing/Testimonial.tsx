'use client'

import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { Quote, Star, CheckCircle, Users, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Testimonial {
  quote: string
  authorName: string
  authorTitle?: string
  authorImage?: { asset?: { url?: string } }
}

export default function TestimonialSection({
  heading,
  testimonials = [],
}: {
  heading?: string
  testimonials?: Testimonial[]
}) {
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const controls = useAnimation()

  const truncateText = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + "..."

  // Auto-sliding animation
  useEffect(() => {
    if (testimonials.length > 0) {
      controls.start({
        x: "-50%",
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: testimonials.length * 8, // 8 seconds per testimonial
            ease: "linear",
          },
        },
      })
    }
  }, [controls, testimonials.length])

  return (
    <section className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] py-24 md:py-32 px-4 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Multiple gradient overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/8 via-transparent to-transparent opacity-60" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-radial from-[#FFE01B]/4 to-transparent opacity-80" />
        
        {/* Animated background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255, 224, 27, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 80% 50%, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 60px 60px'
          }}
        />

        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFE01B]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Large decorative circles */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 border border-[#FFE01B]/8 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 border border-[#FFE01B]/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-full mx-auto">
        {/* Enhanced heading section */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-gray-300/30 rounded-full px-5 py-3 mb-8"
            >
              <Sparkles size={18} className="text-[#FFE01B] animate-pulse" />
              <span className="text-sm text-white font-semibold">Client Love</span>
              <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
            </motion.div>
            
            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-6"
            >
              {heading.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] animate-gradient bg-300%">
                {heading.split(' ').slice(-1)}
              </span>
            </motion.h2>

            {/* Star rating */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-center gap-1 mb-4"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                >
                  <Star size={24} className="text-[#FFE01B] fill-[#FFE01B]" />
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              We'll make you fall in love with our offering—at least, that's what our existing clients say!
            </motion.p>
          </motion.div>
        )}

        {/* Sliding testimonials container */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={controls}
            onHoverStart={() => controls.stop()}
            onHoverEnd={() =>
              controls.start({
                x: "-50%",
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: testimonials.length * 8,
                    ease: "linear",
                  },
                },
              })
            }
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${index}-${testimonial.authorName}`}
                className="group relative flex-shrink-0"
                style={{
                  width: "85vw",
                  maxWidth: "400px",
                  minHeight: expandedTestimonial === index ? "auto" : "480px",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <TestimonialCard 
                  testimonial={testimonial} 
                  index={index}
                  isExpanded={expandedTestimonial === index}
                  onToggleExpand={() => setExpandedTestimonial(expandedTestimonial === index ? null : index)}
                  truncateText={truncateText}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Helper text */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
            >
              👆
            </motion.span>
            Hover over testimonials to pause and read • Click "Read more" for full testimonials
          </p>
        </motion.div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { 
          background-size: 300% 300%; 
          animation: gradient 3s ease infinite; 
        }
        .bg-300\\% { background-size: 300% 300%; }
      `}</style>
    </section>
  )
}

// Enhanced testimonial card component
function TestimonialCard({ 
  testimonial, 
  index, 
  isExpanded, 
  onToggleExpand, 
  truncateText 
}: { 
  testimonial: Testimonial
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  truncateText: (text: string, maxLength: number) => string
}) {
  return (
    <div className="group relative h-full">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 via-[#FFE01B]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 flex flex-col h-full transition-all duration-500 border border-white/20 group-hover:border-[#FFE01B]/30">
        
        {/* Star rating */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex gap-1 mb-6"
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#FFE01B] text-[#FFE01B]" />
          ))}
        </motion.div>

        {/* Quote text with enhanced typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className={`mb-6 ${isExpanded ? "flex-none" : "flex-1"}`}
        >
          <blockquote className="text-[#4B5563] text-lg leading-relaxed italic relative font-medium">
            <span className="text-[#FFE01B] text-3xl font-bold absolute -top-2 -left-1">"</span>
            <span className="ml-6">
              {isExpanded
                ? testimonial.quote
                : truncateText(testimonial.quote, 180)}
            </span>
            <span className="text-[#FFE01B] text-3xl font-bold">"</span>
          </blockquote>
          
          {testimonial.quote.length > 180 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand()
              }}
              className="text-[#FFE01B] hover:text-[#FCD34D] font-bold text-sm mt-3 transition-colors duration-300 ml-6"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </motion.div>

        {/* Enhanced author section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-200/80"
        >
          <div className="relative">
            {testimonial.authorImage?.asset?.url ? (
              <>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B] to-[#FFF045] rounded-full blur opacity-75" />
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <div className="absolute inset-0 bg-[#FFE01B]/20 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <Image
                    src={testimonial.authorImage.asset.url}
                    alt={testimonial.authorName}
                    width={60}
                    height={60}
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                  className="absolute -bottom-1 -right-1 bg-[#FFE01B] rounded-full p-1.5 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4 text-[#241C15]" fill="currentColor" />
                </motion.div>
              </>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 border-2 border-[#FFE01B] shadow-lg">
                <Users className="w-7 h-7" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-[#241C15] text-lg group-hover:text-[#FFE01B] transition-colors duration-500">
              {testimonial.authorName}
            </h4>
            {testimonial.authorTitle && (
              <p className="text-[#4B5563] font-medium mt-1">
                {testimonial.authorTitle}
              </p>
            )}
          </div>
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  )
}