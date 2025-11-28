'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  title: string
  subtitle?: string
  buttons?: { label: string; href: string }[]
  background?: any // Sanity image
}

export default function CTA({
  title,
  subtitle,
  buttons = [],
  background,
}: CTAProps) {
  const primaryButton = buttons[0]

  return (
    <section className="relative overflow-hidden bg-[#241C15] py-28">
      {/* Optional background image */}
      {background && (
        <Image
          src={urlFor(background).url()}
          alt=""
          fill
          className="object-cover object-center absolute inset-0 -z-20 opacity-20"
        />
      )}

      {/* Animated background gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute -left-40 -top-24 w-[480px] h-[480px] rounded-full bg-[#FFE01B] blur-3xl animate-pulse" />
        <div className="absolute right-0 bottom-0 w-[380px] h-[380px] rounded-full bg-yellow-200 blur-3xl opacity-70 animate-pulse" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent capitalize"
        >
          {title}
        </motion.h2>

        {/* Subheading */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA Buttons */}
        {primaryButton && (
          <motion.a
            href={primaryButton.href}
            whileHover={{ scale: 1.06, x: 4 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mt-10 inline-flex items-center gap-2 bg-[#FFE01B] text-black px-10 py-4 rounded-2xl font-semibold shadow-[0_10px_30px_rgba(255,224,27,0.2)] hover:bg-yellow-300 hover:shadow-[0_15px_40px_rgba(255,224,27,0.3)] transition-all"
          >
            {primaryButton.label}
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        )}

        {/* Info row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center gap-12 text-gray-300 text-sm"
        >

          <div className='font-semibold text-white text-xl'>Book your free consultation before spots fill up</div>
          {/* <div className="flex flex-col items-center">
            <span className="opacity-80">Free consultation</span>
            {/* <span className="font-bold text-white">24/7</span> 
          </div>
          <div className="w-px bg-gray-600" />
          <div className="flex flex-col items-center">
            <span className="opacity-80">SLA</span>
            <span className="font-bold text-white">99.9%</span>
          </div> */}
        </motion.div>
      </div>
    </section>
  )
}
