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
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [itemsPerSlide, setItemsPerSlide] = useState(3)

  // Calculate slides
  const calculateSlides = useCallback(() => {
    const itemsPerSlideValue = isMobile ? 1 : 3
    return Math.ceil(studies.length / itemsPerSlideValue)
  }, [studies.length, isMobile])

  const totalSlides = calculateSlides()

  // Responsive check with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        setItemsPerSlide(mobile ? 1 : 3)
        // Reset to first slide when switching modes
        setCurrentSlide(0)
      }, 150)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timeoutId)
    }
  }, [])

  // Get current slide items
  const getCurrentSlideItems = useCallback(() => {
    const start = currentSlide * itemsPerSlide
    const end = start + itemsPerSlide
    return studies.slice(start, end)
  }, [currentSlide, itemsPerSlide, studies])

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (isAnimating || studies.length <= itemsPerSlide) return
    setIsAnimating(true)
    setCurrentSlide(prev => (prev + 1) % totalSlides)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, studies.length, itemsPerSlide, totalSlides])

  const goToPrev = useCallback(() => {
    if (isAnimating || studies.length <= itemsPerSlide) return
    setIsAnimating(true)
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, totalSlides, itemsPerSlide, studies.length])

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide || studies.length <= itemsPerSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, currentSlide, itemsPerSlide, studies.length])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (studies.length <= itemsPerSlide) return

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goToNext()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goToPrev()
    }
  }, [goToNext, goToPrev, studies.length, itemsPerSlide])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#050504] mb-4">
            {heading || 'Case Studies'}
          </h1>
          <p className="text-[##31302f] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Explore how we've helped companies achieve measurable growth and success through strategic solutions.
          </p>
        </motion.header>

        {/* Carousel Container */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons - Only show if more than one slide */}
          {/* {studies.length > itemsPerSlide && (
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goToPrev}
                disabled={isAnimating || currentSlide === 0}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f0eadd] text-gray-700 hover:bg-[#e5e0d1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Previous</span>
              </button>

              <button
                onClick={goToNext}
                disabled={isAnimating || currentSlide === totalSlides - 1}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f0eadd] text-gray-700 hover:bg-[#e5e0d1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md group"
                aria-label="Next slide"
              >
                <span className="font-medium text-sm">Next</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )} */}

          {/* Carousel Track */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              {/* Generate slides */}
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const startIndex = slideIndex * itemsPerSlide
                const slideItems = studies.slice(startIndex, startIndex + itemsPerSlide)

                return (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0"
                    style={{ minWidth: "100%" }}
                  >
                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                      {slideItems.map((study, index) => (
                        <CaseStudyCard
                          key={`${study.slug?.current || `${study.company}-${startIndex + index}`}`}
                          study={study}
                          index={startIndex + index}
                          total={studies.length}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Pagination Dots - Only show if more than one slide */}
          {totalSlides > 1 && (
            <div className="flex flex-col items-center mt-12">
              {/* Dots Container */}
              <div className="flex items-center gap-4 mb-4">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`flex flex-col items-center transition-all duration-300 ${currentSlide === index ? 'scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {/* Dot */}
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 mb-1 ${currentSlide === index
                        ? 'bg-[#050504] scale-125'
                        : 'bg-gray-300'
                      }`} />
                  </button>
                ))}
              </div>

              {studies.length > itemsPerSlide && (
                <div className="flex items-center justify-between mb-8 gap-4">
                  <button
                    onClick={goToPrev}
                    disabled={isAnimating || currentSlide === 0}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f7af00] text-[#050504]  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md group"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Previous</span>
                  </button>

                  <button
                    onClick={goToNext}
                    disabled={isAnimating || currentSlide === totalSlides - 1}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f7af00] text-[#050504] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm border border-gray-200 hover:shadow-md group"
                    aria-label="Next slide"
                  >
                    <span className="font-medium text-sm">Next</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* Slide Info */}
              {/* <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Showing {currentSlide * itemsPerSlide + 1}-
                  {Math.min((currentSlide + 1) * itemsPerSlide, studies.length)} of {studies.length} case studies
                </div>
                <div className="text-xs text-gray-500">
                  {studies.length > itemsPerSlide ? "Click dots or use buttons to navigate" : "All case studies visible"}
                </div>
              </div> */}
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
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 group"
              >
                View All Case Studies
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// Case Study Card Component (no changes to styling)
interface CaseStudyCardProps {
  study: CaseStudy
  index: number
  total: number
}

function CaseStudyCard({
  study,
  index,
  total
}: CaseStudyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.2 }
      }}
      className="group relative h-full"
      aria-labelledby={`case-study-${index}-title`}
    >
      <Link
        href={`/case-studies/${study.slug?.current || ''}`}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-xl"
        aria-label={`View ${study.company} case study - ${study.result?.substring(0, 50)}...`}
      >
        {/* Card Container */}
        <div className="h-full bg-[#f0eadd] rounded-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">

          {/* Hero Image (16:10 ratio) */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {study.image?.asset ? (
              <>
                <Image
                  src={urlFor(study.image).width(800).height(500).url()}
                  alt={study.company || 'Case study thumbnail'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#f0eadd] backdrop-blur-sm text-[#050504] text-xs font-semibold shadow-sm border border-gray-100">
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
              className="text-lg md:text-xl font-medium text-[#050504] mb-3 group-hover:text-gray-700 transition-colors line-clamp-2"
            >
              {study.company || 'Case Study'}
            </h3>

            {/* Impact/Result Summary */}
            {(study.impact || study.result) && (
              <p className="text-[#31302f] text-sm md:text-base mb-4 leading-relaxed line-clamp-3 flex-1">
                {study.impact || study.result}
              </p>
            )}

            {/* Supporting Tags */}
            {study.tags && study.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {study.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-gray-50 text-[#31302f] text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
                {study.tags.length > 3 && (
                  <span className="inline-block px-3 py-1 text-[#31302f] text-xs font-medium">
                    +{study.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <span className="inline-flex items-center text-sm font-semibold text-[#050504] group-hover:text-gray-700 transition-colors">
                Read Case Study
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}