'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Sparkles, Star } from 'lucide-react'
import SectionWrapper from './SectionWrapper'
import { urlFor } from '@/src/sanity/lib/image'

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
  return (
    <div className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] overflow-hidden min-h-screen">
      {/* Enhanced background pattern with multiple layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/8 via-transparent to-transparent opacity-60" />
        
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
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={urlFor(backgroundImage).url()}
            alt={title || 'hero-bg'}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241C15]/80 via-transparent to-[#241C15]/40" />
        </div>
      )}

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFE01B]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Large decorative circles */}
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 border border-[#FFE01B]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 border border-[#FFE01B]/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {foregroundImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Image
              src={urlFor(foregroundImage).url()}
              alt="hero illustration"
              width={600}
              height={400}
              className="object-contain max-w-[90%] sm:max-w-[80%] md:max-w-[70%] drop-shadow-2xl"
            />
          </motion.div>
        </div>
      )}

      <SectionWrapper className="relative z-10 text-center py-16 sm:py-20 md:py-24 px-4 flex items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl w-full"
        >
          {/* Enhanced badge section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          >
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 to-[#FFE01B]/10 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center gap-2 bg-[#FFE01B] text-black px-4 py-2 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                <Sparkles size={14} />
                <span>Premium • Enterprise</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <Star size={14} className="text-[#FFE01B]" />
              <span>Trusted by 10,000+ growing teams</span>
            </div>
          </motion.div>

          {/* Enhanced title with better typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {title}
              </motion.span>
              <motion.span 
                className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black"
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
              className="mb-12"
            >
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light">
                {subtitle}
              </p>
            </motion.div>
          )}

          {/* Enhanced CTA buttons */}
          {ctas?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              {ctas.map((cta, index) => {
                const isSecondary = cta.variant === 'secondary'
                return (
                  <motion.a
                    key={cta.href}
                    href={cta.href}
                    className={
                      isSecondary
                        ? 'group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-400 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm bg-black/20'
                        : 'group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-2xl text-base sm:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#FFE01B]/25'
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!isSecondary && (
                      <>
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B] to-[#FFF045] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-[#FFE01B] text-black px-8 py-4 rounded-2xl flex items-center gap-3">
                          <span>{cta.label}</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </>
                    )}
                    {isSecondary && (
                      <>
                        <span>{cta.label}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.a>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </SectionWrapper>

      {/* Enhanced floating decorative elements */}
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute left-4 sm:left-8 top-8 sm:top-12 text-[#FFE01B]"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap size={40} className="sm:w-12 sm:h-12 drop-shadow-lg" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2"
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute left-1/4 bottom-8 sm:bottom-12"
      >
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[#FFE01B]/30"
        >
          <Sparkles size={24} />
        </motion.div>
      </motion.div>
    </div>
  )
}