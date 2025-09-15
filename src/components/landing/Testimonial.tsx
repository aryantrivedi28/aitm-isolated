'use client'

import Image from 'next/image'
import { motion, useAnimation, useMotionValue } from 'framer-motion'
import { Quote, Star, CheckCircle, Users, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

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
      const [isMobile, setIsMobile] = useState(false)
      const [currentIndex, setCurrentIndex] = useState(0)
      const controls = useAnimation()
      const containerRef = useRef<HTMLDivElement>(null)
      const dragX = useMotionValue(0)
      const [positions, setPositions] = useState<{ left: string; top: string }[]>([])

      useEffect(() => {
            setPositions(
                  Array.from({ length: 5 }, () => ({
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                  }))
            )
      }, [])

      const truncateText = (text: string, maxLength: number) =>
            text.length <= maxLength ? text : text.substring(0, maxLength) + "..."

      // Check if mobile on mount and resize
      useEffect(() => {
            const checkMobile = () => {
                  setIsMobile(window.innerWidth < 768)
            }

            checkMobile()
            window.addEventListener('resize', checkMobile)
            return () => window.removeEventListener('resize', checkMobile)
      }, [])

      // Auto-sliding animation for desktop only
      useEffect(() => {
            if (testimonials.length > 0 && !isMobile) {
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
            } else {
                  controls.stop()
            }
      }, [controls, testimonials.length, isMobile])

      // Mobile swipe handlers
      const onDragEnd = () => {
            const threshold = 100
            const x = dragX.get()

            if (x <= -threshold) {
                  // Swipe left - next card
                  setCurrentIndex(prev => (prev + 1) % testimonials.length)
            } else if (x >= threshold) {
                  // Swipe right - previous card
                  setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
            }
      }

      const goToNext = () => {
            setCurrentIndex(prev => (prev + 1) % testimonials.length)
      }

      const goToPrev = () => {
            setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
      }



      return (
            <section className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] py-16 md:py-32 px-4 overflow-hidden">
                  {/* Enhanced background elements */}
                  <div className="absolute inset-0 pointer-events-none">
                        {/* Multiple gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/8 via-transparent to-transparent opacity-40 md:opacity-60" />
                        <div className="absolute top-1/3 left-1/4 md:left-1/3 w-64 md:w-96 h-64 md:h-96 bg-gradient-radial from-[#FFE01B]/4 to-transparent opacity-60 md:opacity-80" />

                        {/* Animated background pattern */}
                        <div
                              className="absolute inset-0 opacity-[0.02] md:opacity-[0.015]"
                              style={{
                                    backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255, 224, 27, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 80% 50%, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
                                    backgroundSize: '60px 60px, 40px 40px'
                              }}
                        />

                        {/* Floating elements */}
                        {positions.map((pos, i) => (
                              <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-[#FFE01B]/20 rounded-full"
                                    style={pos}
                                    animate={{ y: [-5, 5, -5], opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                              />
                        ))}

                        {/* Large decorative circles */}
                        <motion.div
                              className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-24 h-24 md:w-40 md:h-40 border border-[#FFE01B]/8 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                              className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 w-32 h-32 md:w-60 md:h-60 border border-[#FFE01B]/5 rounded-full"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                        />
                  </div>

                  <div className="relative z-10 max-w-full mx-auto">
                        {/* Enhanced heading section */}
                        {heading && (
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center mb-12 md:mb-20 px-2"
                              >
                                    {/* Badge */}
                                    <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          whileInView={{ opacity: 1, scale: 1 }}
                                          viewport={{ once: true, margin: "-50px" }}
                                          transition={{ delay: 0.1, duration: 0.5 }}
                                          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-gray-300/30 rounded-full px-4 py-2 mb-6 md:mb-8"
                                    >
                                          <Sparkles size={16} className="text-[#FFE01B] animate-pulse" />
                                          <span className="text-xs md:text-sm text-white font-semibold">Client Love</span>
                                          <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-full animate-ping" />
                                    </motion.div>

                                    {/* Main heading */}
                                    <motion.h2
                                          initial={{ opacity: 0, y: 15 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true, margin: "-50px" }}
                                          transition={{ delay: 0.2, duration: 0.6 }}
                                          className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-4 md:mb-6"
                                    >
                                          {heading.split(' ').slice(0, -1).join(' ')}{' '}
                                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] animate-gradient bg-300%">
                                                {heading.split(' ').slice(-1)}
                                          </span>
                                    </motion.h2>

                                    {/* Star rating */}
                                    <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true, margin: "-50px" }}
                                          transition={{ delay: 0.3, duration: 0.5 }}
                                          className="flex items-center justify-center gap-1 mb-3 md:mb-4"
                                    >
                                          {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                      key={i}
                                                      initial={{ scale: 0, rotate: -180 }}
                                                      whileInView={{ scale: 1, rotate: 0 }}
                                                      viewport={{ once: true, margin: "-50px" }}
                                                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                                                >
                                                      <Star size={20} className="text-[#FFE01B] fill-[#FFE01B] md:w-6 md:h-6" />
                                                </motion.div>
                                          ))}
                                    </motion.div>

                                    <motion.p
                                          initial={{ opacity: 0, y: 10 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true, margin: "-50px" }}
                                          transition={{ delay: 0.5, duration: 0.5 }}
                                          className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2"
                                    >
                                          We'll make you fall in love with our offering—at least, that's what our existing clients say!
                                    </motion.p>
                              </motion.div>
                        )}

                        {/* Testimonials container - different layout for mobile */}
                        {isMobile ? (
                              // Mobile sliding carousel
                              <div className="relative overflow-hidden">
                                    <motion.div
                                          className="flex cursor-grab active:cursor-grabbing"
                                          drag="x"
                                          dragConstraints={{ left: -testimonials.length * 100 + 100, right: 0 }}
                                          style={{ x: dragX }}
                                          onDragEnd={onDragEnd}
                                          animate={{ x: -currentIndex * 100 + "%" }}
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}

                                    >
                                          {testimonials.map((testimonial, index) => (
                                                <div
                                                      key={index}
                                                      className="w-full flex-shrink-0 px-3"
                                                      style={{ minWidth: "100%" }}
                                                >
                                                      <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{
                                                                  opacity: currentIndex === index ? 1 : 0.7,
                                                                  scale: currentIndex === index ? 1 : 0.95
                                                            }}
                                                            transition={{ duration: 0.3 }}
                                                            className="w-full"
                                                      >
                                                            <TestimonialCard
                                                                  testimonial={testimonial}
                                                                  index={index}
                                                                  isExpanded={expandedTestimonial === index}
                                                                  onToggleExpand={() => setExpandedTestimonial(expandedTestimonial === index ? null : index)}
                                                                  truncateText={truncateText}
                                                                  isMobile={isMobile}
                                                            />
                                                      </motion.div>
                                                </div>
                                          ))}
                                    </motion.div>

                                    {/* Mobile navigation arrows */}
                                    <div className="flex justify-center items-center mt-6 space-x-4">
                                          <button
                                                onClick={goToPrev}
                                                className="p-2 rounded-full bg-[#FFE01B] text-[#241C15] hover:bg-[#FCD34D] transition-colors shadow-md"
                                                aria-label="Previous testimonial"
                                          >
                                                <ChevronLeft size={20} />
                                          </button>

                                          {/* Indicator dots */}
                                          <div className="flex space-x-2 mx-4">
                                                {testimonials.map((_, index) => (
                                                      <button
                                                            key={index}
                                                            onClick={() => setCurrentIndex(index)}
                                                            className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-[#FFE01B] scale-125' : 'bg-gray-400'
                                                                  }`}
                                                            aria-label={`Go to testimonial ${index + 1}`}
                                                      />
                                                ))}
                                          </div>

                                          <button
                                                onClick={goToNext}
                                                className="p-2 rounded-full bg-[#FFE01B] text-[#241C15] hover:bg-[#FCD34D] transition-colors shadow-md"
                                                aria-label="Next testimonial"
                                          >
                                                <ChevronRight size={20} />
                                          </button>
                                    </div>

                                    {/* Swipe hint for mobile */}
                                    <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 1 }}
                                          className="text-center mt-4"
                                    >
                                          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
                                                <motion.span
                                                      animate={{ x: [-5, 5, -5] }}
                                                      transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                      👆
                                                </motion.span>
                                                Swipe or use arrows to navigate
                                          </p>
                                    </motion.div>
                              </div>
                        ) : (
                              // Horizontal sliding layout for desktop
                              <div className="relative overflow-hidden" ref={containerRef}>
                                    <motion.div
                                          className="flex gap-5 lg:gap-6"
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
                                                            width: "clamp(300px, 28vw, 400px)",
                                                            minHeight: expandedTestimonial === index ? "auto" : "420px",
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
                                                            isMobile={isMobile}
                                                      />
                                                </motion.div>
                                          ))}
                                    </motion.div>
                              </div>
                        )}

                        {/* Helper text for desktop */}
                        {!isMobile && (
                              <motion.div
                                    className="text-center mt-6 md:mt-8"
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
                        )}
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
      truncateText,
      isMobile
}: {
      testimonial: Testimonial
      index: number
      isExpanded: boolean
      onToggleExpand: () => void
      truncateText: (text: string, maxLength: number) => string
      isMobile: boolean
}) {
      return (
            <div className="group relative h-full">
                  {/* Glow effect - only on desktop */}
                  {!isMobile && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 via-[#FFE01B]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  )}

                  {/* Hover gradient overlay - only on desktop */}
                  {!isMobile && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  )}

                  {/* Main card */}
                  <div className={`relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl p-5 md:p-6 lg:p-8 flex flex-col h-full transition-all duration-300 border border-white/20 ${!isMobile && 'group-hover:border-[#FFE01B]/30'}`}>

                        {/* Star rating */}
                        <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ delay: 0.1 + index * 0.1 }}
                              className="flex gap-0.5 md:gap-1 mb-4 md:mb-6"
                        >
                              {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFE01B] text-[#FFE01B]" />
                              ))}
                        </motion.div>

                        {/* Quote text with enhanced typography */}
                        <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className={`mb-4 md:mb-6 ${isExpanded ? "flex-none" : "flex-1"}`}
                        >
                              <blockquote className="text-[#4B5563] text-base md:text-lg leading-relaxed italic relative font-medium">
                                    <span className="text-[#FFE01B] text-2xl md:text-3xl font-bold absolute -top-1 -left-1 md:-top-2 md:-left-1">"</span>
                                    <span className="ml-5 md:ml-6">
                                          {isExpanded
                                                ? testimonial.quote
                                                : truncateText(testimonial.quote, isMobile ? 120 : 180)}
                                    </span>
                                    <span className="text-[#FFE01B] text-2xl md:text-3xl font-bold">"</span>
                              </blockquote>

                              {testimonial.quote.length > (isMobile ? 120 : 180) && (
                                    <button
                                          onClick={(e) => {
                                                e.stopPropagation()
                                                onToggleExpand()
                                          }}
                                          className="text-[#FFE01B] hover:text-[#FCD34D] font-bold text-xs md:text-sm mt-2 transition-colors duration-300 ml-5 md:ml-6"
                                    >
                                          {isExpanded ? "Show less" : "Read more"}
                                    </button>
                              )}
                        </motion.div>

                        {/* Enhanced author section */}
                        <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-center gap-3 md:gap-4 mt-auto pt-4 md:pt-6 border-t border-gray-200/80"
                        >
                              <div className="relative">
                                    {testimonial.authorImage?.asset?.url ? (
                                          <>
                                                {!isMobile && (
                                                      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B] to-[#FFF045] rounded-full blur opacity-75" />
                                                )}
                                                <motion.div whileHover={{ scale: isMobile ? 1 : 1.05 }} className="relative">
                                                      {!isMobile && (
                                                            <div className="absolute inset-0 bg-[#FFE01B]/20 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                                      )}
                                                      <Image
                                                            src={testimonial.authorImage.asset.url}
                                                            alt={testimonial.authorName}
                                                            width={56}
                                                            height={56}
                                                            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-lg"
                                                      />
                                                </motion.div>
                                                <motion.div
                                                      initial={{ scale: 0 }}
                                                      whileInView={{ scale: 1 }}
                                                      viewport={{ once: true, margin: "-50px" }}
                                                      transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                                                      className="absolute -bottom-1 -right-1 bg-[#FFE01B] rounded-full p-1 md:p-1.5 shadow-lg"
                                                >
                                                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#241C15]" fill="currentColor" />
                                                </motion.div>
                                          </>
                                    ) : (
                                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 border-2 border-[#FFE01B] shadow-lg">
                                                <Users className="w-5 h-5 md:w-6 md:h-6" />
                                          </div>
                                    )}
                              </div>

                              <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#241C15] text-base md:text-lg truncate group-hover:text-[#FFE01B] transition-colors duration-500">
                                          {testimonial.authorName}
                                    </h4>
                                    {testimonial.authorTitle && (
                                          <p className="text-[#4B5563] font-medium text-sm md:text-base mt-0.5 truncate">
                                                {testimonial.authorTitle}
                                          </p>
                                    )}
                              </div>
                        </motion.div>

                        {/* Bottom accent line - only on desktop */}
                        {!isMobile && (
                              <motion.div
                                    className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                              />
                        )}
                  </div>
            </div>
      )
}