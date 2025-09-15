'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Sparkles, ExternalLink, Star } from 'lucide-react'
import { urlFor } from '@/src/sanity/lib/image'

interface CaseStudy {
  slug?: { current?: string }
  image?: any
  company?: string
  result?: string
  tags?: string[]
}

export default function ShortCaseStudies({
  heading,
  studies = [],
}: {
  heading?: string
  studies?: CaseStudy[]
}) {
  return (
    <section className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] py-20 md:py-28 px-4 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Multiple gradient layers */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/6 via-transparent to-transparent opacity-70" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#FFE01B]/3 to-transparent opacity-60" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-16 left-20 w-3 h-3 bg-[#FFE01B]/20 rounded-full"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-16 w-2 h-2 bg-[#FFE01B]/30 rounded-full"
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />

        {/* Large rotating decoration */}
        <motion.div
          className="absolute -top-32 -right-32 w-64 h-64 border border-[#FFE01B]/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
              className="inline-flex items-center gap-2 bg-[#FFE01B]/10 backdrop-blur-sm border border-[#FFE01B]/20 rounded-full px-6 py-3 mb-8"
            >
              <TrendingUp size={18} className="text-[#FFE01B]" />
              <span className="text-sm text-[#FFE01B] font-semibold tracking-wide">Success Stories</span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-6"
            >
              {heading.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B]">
                {heading.split(' ').slice(-2).join(' ')}
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-300 text-lg max-w-3xl mx-auto"
            >
              Real results from real companies who trusted us to transform their business
            </motion.p>
          </motion.div>
        )}

        {/* Enhanced case studies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {studies.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 via-[#FFE01B]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700" />

              {/* Main card */}
              <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/20 group-hover:border-[#FFE01B]/30">
                <Link href={`/case-studies/${c.slug?.current || ''}`} className="flex flex-col h-full">
                  {/* Enhanced image section */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

                    {c.image?.asset ? (
                      <Image
                        src={urlFor(c.image).url()}
                        alt={c.company || ''}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400">
                        <div className="text-center">
                          <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                          <span className="text-sm">No image</span>
                        </div>
                      </div>
                    )}

                    {/* Floating success indicator */}
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6, type: "spring" }}
                      className="absolute top-4 right-4 z-20 bg-[#FFE01B] text-black p-2 rounded-full shadow-lg"
                    >
                      <Star size={16} fill="currentColor" />
                    </motion.div>
                  </div>

                  {/* Enhanced content section */}
                  <div className="flex flex-col flex-1 p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-4">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="text-2xl font-black text-[#241C15] mb-3 group-hover:text-[#241C15] transition-colors line-clamp-2"
                      >
                        {c.company || 'Untitled'}
                      </motion.h3>

                      {/* Primary tag with enhanced styling */}
                      {c.tags?.[0] && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="inline-flex items-center gap-1 text-sm font-bold text-white bg-gradient-to-r from-[#241C15] to-[#2A1F17] rounded-full px-4 py-2 shadow-md"
                        >
                          <div className="w-2 h-2 bg-[#FFE01B] rounded-full" />
                          {c.tags[0]}
                        </motion.span>
                      )}
                    </div>

                    {/* Result summary with better typography */}
                    {c.result && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="text-[#4B5563] line-clamp-3 mb-6 leading-relaxed text-base font-medium"
                      >
                        {c.result}
                      </motion.p>
                    )}

                    {/* Enhanced tags section */}
                    {c.tags && c.tags.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="mt-auto border-t border-gray-200/80"
                      >
                        <div className="flex flex-wrap gap-2 mb-4">
                          {c.tags.slice(1, 4).map((t, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-xs px-3 py-2 rounded-full bg-[#FFE01B]/90 text-[#241C15] font-bold hover:bg-[#FFE01B] transition-colors shadow-sm border border-[#FFE01B]/20"
                            >
                              {t}
                            </span>
                          ))}
                          {c.tags.length > 4 && (
                            <span className="inline-flex items-center text-xs px-3 py-2 rounded-full bg-gray-100 text-[#4B5563] font-medium border border-gray-200">
                              +{c.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced CTA */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="border-t border-gray-200/80"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center text-base font-bold text-[#241C15] group-hover:text-[#FFE01B] transition-colors">
                          View Case Study
                          <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </span>

                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ rotate: 45 }}
                        >
                          <ExternalLink size={18} className="text-[#FFE01B]" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </Link>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 0 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                className="w-3 h-3 bg-[#FFE01B]/40 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}