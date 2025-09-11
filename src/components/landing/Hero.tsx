'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import SectionWrapper from './SectionWrapper'
import { urlFor } from '@/src/sanity/lib/image' // keep if you have Sanity images

interface HeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: any
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroProps) {
  return (
    <div className="relative bg-[#241C15] overflow-hidden">
      {/* subtle radial gradient / pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="g1" cx="20%" cy="20%">
              <stop offset="0%" stopColor="#FFE01B" stopOpacity="0.06" />
              <stop offset="60%" stopColor="#241C15" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#g1)" />
        </svg>
      </div>

      {backgroundImage && (
        <Image
          src={urlFor(backgroundImage).url()}
          alt={title || 'hero-bg'}
          fill
          className="object-cover opacity-6"
        />
      )}

      <SectionWrapper className="relative z-10 text-center py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 mb-6 mx-auto">
            <div className="rounded-full bg-[#FFE01B] text-black px-3 py-1 text-sm font-medium tracking-wide">
              Premium • Enterprise
            </div>
            <div className="text-gray-300 text-sm">Trusted by fast-growing teams</div>
          </div>

          <motion.h1
            initial={{ scale: 0.99 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
            className="text-white text-4xl md:text-6xl font-extrabold leading-tight"
          >
            {/* play with layered typography */}
            <span className="block">{title}</span>
            <span className="block mt-3 text-[#FFE01B] text-3xl md:text-4xl font-black tracking-tight">
              {/** subtle accent line */}
              Accelerate · Delight · Scale
            </span>
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 text-gray-300 text-lg max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                className="inline-flex items-center gap-3 bg-[#FFE01B] text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:bg-yellow-300 transition-transform transform hover:-translate-y-0.5"
              >
                <span>{ctaText}</span>
                <ArrowRight size={18} />
              </a>
            )}

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-300 hover:text-white transition-colors"
            >
              Demo &nbsp; <Sparkles size={16} />
            </a>
          </motion.div>
        </motion.div>
      </SectionWrapper>

      {/* floating decorative shapes (subtle motion) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute -left-10 top-8 text-[#FFE01B] opacity-90"
      >
        <Zap size={48} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute right-8 bottom-12 text-white/20"
      >
        <svg width="92" height="92" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="#FFE01B" strokeOpacity="0.12" strokeWidth="2" />
          <path d="M20 60 C36 42, 64 42, 80 60" stroke="#FFE01B" strokeOpacity="0.06" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  )
}
