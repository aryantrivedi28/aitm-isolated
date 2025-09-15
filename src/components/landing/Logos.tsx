'use client'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { Sparkles, TrendingUp, Users } from 'lucide-react'
import { useEffect } from 'react'
import { urlFor } from '@/src/sanity/lib/image'

interface Logo {
  asset?: any
  alt?: string
}

export default function Logos({ heading, logos = [] }: { heading?: string; logos?: Logo[] }) {
  const controls = useAnimation()

  // Auto-sliding animation for logos
  useEffect(() => {
    if (logos.length > 0) {
      controls.start({
        x: "-100%",
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: logos.length * 3, // 3 seconds per logo
            ease: "linear",
          },
        },
      })
    }
  }, [controls, logos.length])

  return (
    <section className="relative bg-gradient-to-br from-[#FAFAFA] via-white to-[#F5F5F5] py-16 md:py-24 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/3 via-transparent to-transparent opacity-60" />
        
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating decorative elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFE01B]/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Enhanced heading section */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#FFE01B]/10 backdrop-blur-sm border border-[#FFE01B]/20 rounded-full px-6 py-3 mb-8"
            >
              <TrendingUp size={18} className="text-[#241C15]" />
              <span className="text-sm text-[#241C15] font-semibold tracking-wide">Trusted Partners</span>
            </motion.div>
            
            {/* Main heading */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-[#241C15] mb-4"
            >
              {heading.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B]">
                {heading.split(' ').slice(-2).join(' ')}
              </span>
            </motion.h3>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Join the growing list of companies that trust us to deliver exceptional results
            </motion.p>
          </motion.div>
        )}

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-center gap-8 mb-16 flex-wrap"
        >
          <div className="flex items-center gap-2 text-[#241C15]">
            <Users size={20} className="text-[#FFE01B]" />
            <span className="font-bold text-lg">{logos.length}+</span>
            <span className="text-gray-600">Partners</span>
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2 text-[#241C15]">
            <Sparkles size={20} className="text-[#FFE01B]" />
            <span className="font-bold text-lg">99%</span>
            <span className="text-gray-600">Satisfaction</span>
          </div>
        </motion.div>

        {/* Sliding logos container */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-12 md:gap-16"
              animate={controls}
              onHoverStart={() => controls.stop()}
              onHoverEnd={() =>
                controls.start({
                  x: "-100%",
                  transition: {
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: logos.length * 3,
                      ease: "linear",
                    },
                  },
                })
              }
              style={{ width: `${logos.length * 200}px` }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <motion.div
                  key={`${index}-${logo.alt}`}
                  className="flex-shrink-0 group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % logos.length) * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className="relative w-32 h-20 md:w-40 md:h-24 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 group-hover:border-[#FFE01B]/30 p-4 flex items-center justify-center overflow-hidden">
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {logo.asset ? (
                      <div className="relative w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-500">
                        <Image 
                          src={urlFor(logo.asset).url()} 
                          alt={logo.alt || 'logo'} 
                          fill 
                          className="object-contain p-2" 
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-[#FFE01B]/30 group-hover:text-[#FFE01B] transition-all duration-500">
                        <div className="text-center">
                          <Sparkles size={24} className="mx-auto mb-1 opacity-50" />
                          <span className="text-xs font-medium">Logo</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Corner accent */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-[#FFE01B]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom helper text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.span>
            Hover over logos to pause animation
          </p>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.8, 0.3] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
                className="w-2 h-2 bg-[#FFE01B]/40 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}