'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Sparkles, Star, ChevronRight } from 'lucide-react'
import SectionWrapper from './SectionWrapper'
import { urlFor } from '@/src/sanity/lib/image'
import { useEffect, useState } from 'react'

interface CTA {
  label: string
  href: string
  variant?: string
}

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: any
  foregroundImage?: any
  ctas?: CTA[]
}

export default function Hero({
  title,
  subtitle,
  backgroundImage,
  foregroundImage,
  ctas = [],
}: HeroProps) {
  const [particles, setParticles] = useState<
    { left: string; top: string; duration: number; delay: number }[]
  >([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Generate particles
    setParticles(
      Array.from({ length: isMobile ? 8 : 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    )
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  // Function to split title into manageable parts for mobile
  const splitTitle = (text: string) => {
    if (isMobile && text.length > 30) {
      // Split by words and try to create balanced lines
      const words = text.split(' ')
      const midPoint = Math.ceil(words.length / 2)
      const firstLine = words.slice(0, midPoint).join(' ')
      const secondLine = words.slice(midPoint).join(' ')
      return [firstLine, secondLine]
    }
    return [text]
  }

  const titleLines = splitTitle(title)

  return (
    <div className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] overflow-hidden min-h-[80vh] md:min-h-screen">
      {/* Enhanced background pattern with multiple layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/8 via-transparent to-transparent opacity-40 md:opacity-60" />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="g1" cx="20%" cy="20%">
                <stop offset="0%" stopColor="#FFE01B" stopOpacity="0.12" />
                <stop offset="40%" stopColor="#FFE01B" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#241C15" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g2" cx="80%" cy="80%">
                <stop offset="0%" stopColor="#FFE01B" stopOpacity="0.08" />
                <stop offset="60%" stopColor="#241C15" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#g1)" />
            <rect x="0" y="0" width="100" height="100" fill="url(#g2)" />
          </svg>
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 224, 27, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={title || 'hero-bg'}
            fill
            className="object-cover opacity-20 md:opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241C15]/80 via-transparent to-[#241C15]/40" />
        </div>
      )}

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFE01B]/20 rounded-full"
            style={{ left: p.left, top: p.top }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}

        {foregroundImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="w-full max-w-[90%] md:max-w-[70%]"
            >
              <Image
                src={urlFor(foregroundImage).url()}
                alt="hero illustration"
                width={600}
                height={400}
                className="object-contain w-full h-auto drop-shadow-xl"
                priority
              />
            </motion.div>
          </div>
        )}
      </div>

      <SectionWrapper className="relative z-10 text-center py-12 md:py-24 px-4 flex items-center min-h-[80vh] md:min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl w-full mt-8 md:mt-0"
        >
          {/* Enhanced badge section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8"
          >
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 to-[#FFE01B]/10 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center gap-2 bg-[#FFE01B] text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-lg">
                <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
                <span>Premium • Enterprise</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-xs md:text-sm">
              <Star size={12} className="text-[#FFE01B] md:w-3.5 md:h-3.5" />
              <span>Trusted by 50+ Companies</span>
            </div>
          </motion.div>

          {/* Enhanced title with better mobile typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 md:mb-8 px-2"
          >
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight max-w-5xl mx-auto">
              {titleLines.map((line, index) => (
                <motion.span
                  key={index}
                  className="block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {line}
                </motion.span>
              ))}
              <motion.span
                className="block mt-3 md:mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] text-lg sm:text-xl md:text-2xl lg:text-3xl font-black"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                Accelerate · Delight · Scale
              </motion.span>
            </h1>
          </motion.div>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mb-8 md:mb-12 px-4"
            >
              <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                {subtitle}
              </p>
            </motion.div>
          )}

          {/* Enhanced CTA buttons - mobile optimized */}
          {ctas?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-2"
            >
              {ctas.map((cta, index) => {
                const isSecondary = cta.variant === 'secondary'
                return (
                  <motion.a
                    key={cta.href}
                    href={cta.href}
                    className={
                      isSecondary
                        ? 'group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-400 transition-all duration-300 text-sm md:text-base backdrop-blur-sm bg-black/20'
                        : 'group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-xl md:shadow-2xl text-sm md:text-base transition-all duration-300 transform hover:-translate-y-0.5 md:hover:-translate-y-1 hover:shadow-[#FFE01B]/25'
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!isSecondary && (
                      <>
                        <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-[#FFE01B] to-[#FFF045] rounded-xl md:rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-[#FFE01B] text-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 w-full">
                          <span className="truncate">{cta.label}</span>
                          <ArrowRight size={16} className="md:w-5 md:h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </>
                    )}
                    {isSecondary && (
                      <>
                        <span className="truncate">{cta.label}</span>
                        <ChevronRight size={16} className="md:w-5 md:h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </motion.a>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </SectionWrapper>

      {/* Enhanced floating decorative elements - mobile optimized */}
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute left-2 sm:left-4 top-4 sm:top-8 text-[#FFE01B]"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 drop-shadow-lg" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2"
      >
        <motion.svg
          width="50"
          height="50"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#FFE01B"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeDasharray="10 5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#FFE01B"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
          <path
            d="M30 50 C40 35, 60 35, 70 50 C60 65, 40 65, 30 50"
            stroke="#FFE01B"
            strokeOpacity="0.15"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute left-1/4 bottom-4 sm:bottom-8"
      >
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[#FFE01B]/30"
        >
          <Sparkles size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </motion.div>
      </motion.div>
    </div>   
  )
}