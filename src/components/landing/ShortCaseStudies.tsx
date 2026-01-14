'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/src/sanity/lib/image'
import { useEffect, useState, useRef, useCallback } from 'react'

interface CaseStudy {
  slug?: { current?: string }
  image?: any
  company?: string
  result?: string
  tags?: string[]
  category?: string
  impact?: string
}

export default function CaseStudiesGrid({
  heading,
  studies = [],
}: {
  heading?: string
  studies?: CaseStudy[]
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Responsive check with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 150)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timeoutId)
    }
  }, [])

  // Mobile swipe handlers
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % studies.length)
  }, [studies.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + studies.length) % studies.length)
  }, [studies.length])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMobile || !carouselRef.current?.contains(document.activeElement)) return
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goToNext()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goToPrev()
    }
  }, [isMobile, goToNext, goToPrev])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle swipe on mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }
  }

  // Calculate optimal grid columns based on screen size
  const getGridColumns = () => {
    if (typeof window === 'undefined') return 1
    const width = window.innerWidth
    if (width >= 1280) return 4 // xl screens
    if (width >= 1024) return 3 // lg screens
    if (width >= 768) return 2  // md screens
    return 1 // mobile
  }

  return (
    <section 
      className="relative bg-gradient-to-b from-[#faf4e5] py-16 md:py-24 px-4 md:px-8"
      aria-label="Case studies showcasing our work"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {heading || 'Case Studies'}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Explore how we've helped companies achieve measurable growth and success through strategic solutions.
          </p>
        </motion.header>

        {/* Desktop: Grid Layout */}
        {!isMobile ? (
          <div 
            ref={containerRef}
            className={`grid gap-6 md:gap-8 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {studies.map((study, index) => {
              // Calculate staggered animation delay based on grid position
              const columns = getGridColumns()
              const row = Math.floor(index / columns)
              const column = index % columns
              const delay = (row * 0.08) + (column * 0.03)
              
              return (
                <CaseStudyCard
                  key={study.slug?.current || `${study.company}-${index}`}
                  study={study}
                  index={index}
                  total={studies.length}
                  delay={delay}
                  isHovering={isHovering}
                />
              )
            })}
          </div>
        ) : (
          /* Mobile: Swipeable Carousel */
          <div 
            ref={carouselRef}
            className="relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="overflow-hidden px-2">
              <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.5 
                }}
              >
                {studies.map((study, index) => (
                  <div
                    key={study.slug?.current || `${study.company}-${index}`}
                    className="w-full flex-shrink-0 px-2"
                    style={{ minWidth: "100%" }}
                  >
                    <CaseStudyCard
                      study={study}
                      index={index}
                      total={studies.length}
                      delay={index * 0.1}
                      isMobile={true}
                      isActive={currentIndex === index}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-center mt-8 px-4">
              <button
                onClick={goToPrev}
                className="p-3 rounded-full bg-[#f0eadd] text-gray-700 hover:bg-gray-50  transition-all duration-200 shadow-md border border-gray-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Previous case study"
                disabled={studies.length <= 1}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center space-x-2 mx-6">
                {studies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 ${currentIndex === index 
                      ? 'bg-gray-900 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to case study ${index + 1}`}
                    aria-current={currentIndex === index ? 'true' : 'false'}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {currentIndex + 1} / {studies.length}
                </span>
              </div>

              <button
                onClick={goToNext}
                className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-md border border-gray-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Next case study"
                disabled={studies.length <= 1}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Helper Text */}
            <p className="text-center text-gray-500 text-sm mt-4 px-4">
              Swipe, use arrows, or tap dots to browse case studies
            </p>
          </div>
        )}

        {/* View All Button (for scalability) */}
        {studies.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 md:mt-16"
          >
            <Link 
              href="/case-studies"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              View All Case Studies
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              Showing {Math.min(8, studies.length)} of {studies.length} case studies
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Enhanced Case Study Card Component
interface CaseStudyCardProps {
  study: CaseStudy
  index: number
  total: number
  delay?: number
  isHovering?: boolean
  isMobile?: boolean
  isActive?: boolean
}

function CaseStudyCard({ 
  study, 
  index, 
  total, 
  delay = 0,
  isHovering = false,
  isMobile = false,
  isActive = true 
}: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-100px" : "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1] // Custom easing for premium feel
      }}
      whileHover={!isMobile ? { 
        y: -6,
        transition: { duration: 0.2 }
      } : {}}
      animate={isMobile ? {
        scale: isActive ? 1 : 0.98,
        opacity: isActive ? 1 : 0.7
      } : {}}
      className="group relative h-full"
      aria-labelledby={`case-study-${index}-title`}
    >
      <Link 
        href={`/case-studies/${study.slug?.current || ''}`}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-xl"
        aria-label={`View ${study.company} case study - ${study.result?.substring(0, 50)}...`}
      >
        {/* Card Container */}
        <div className="h-full bg-[#f0eadd] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
          
          {/* Hero Image (16:10 ratio) */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {study.image?.asset ? (
              <>
                <Image
                  src={urlFor(study.image).width(800).height(500).url()}
                  alt={study.company || 'Case study thumbnail'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 4}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-3 text-gray-300">🏢</div>
                  <span className="text-gray-400 text-sm font-medium">{study.company}</span>
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            {(study.category || study.tags?.[0]) && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold shadow-sm border border-gray-100">
                  {study.category || study.tags?.[0]}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 md:p-6 flex flex-col">
            {/* Company Name */}
            <h3 
              id={`case-study-${index}-title`}
              className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2"
            >
              {study.company || 'Case Study'}
            </h3>

            {/* Impact/Result Summary */}
            {(study.impact || study.result) && (
              <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed line-clamp-3 flex-1">
                {study.impact || study.result}
              </p>
            )}

            {/* Supporting Tags */}
            {study.tags && study.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {study.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {study.tags.length > 3 && (
                  <span className="inline-block px-3 py-1 text-gray-500 text-xs font-medium">
                    +{study.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <span className="inline-flex items-center text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                Read Case Study
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              {!isMobile && (
                <span className="text-xs text-gray-400 font-medium">
                  {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                </span>
              )}
            </div>
          </div>

          {/* Hover indicator */}
          {!isMobile && (
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-xl transition-all duration-300 pointer-events-none" />
          )}
        </div>
      </Link>
    </motion.article>
  )
}