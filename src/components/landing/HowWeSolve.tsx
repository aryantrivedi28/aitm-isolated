'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import { CheckCircle } from 'lucide-react'

interface Solution {
  title: string
  description: string
  image?: any
}

export default function HowWeSolve({
  heading,
  solutions = [],
}: {
  heading?: string
  solutions?: Solution[]
}) {
  return (
    <section className="relative overflow-hidden bg-[#fbf5e5] py-24">
      {/* Animated background blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-25"></div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 text-center relative capitalize">
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FFE01B] to-[#f5d000] bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(255, 224, 27, 0.15))'
            }}
          >
            {heading}
          </motion.h2>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {solutions.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="p-8 rounded-2xl bg-white backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all border border-[#241C15]/5"
            >
              {/* icon / image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2, type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-[#FFE01B]/15 ring-4 ring-[#FFE01B]/30 overflow-hidden"
              >
                {it.image ? (
                  <Image
                    src={urlFor(it.image).url()}
                    alt={it.title}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <CheckCircle className="w-9 h-9 text-[#FFE01B]" />
                )}
              </motion.div>

              <h3 className="mt-6 text-2xl font-semibold text-[#241C15]">
                {it.title}
              </h3>
              <p className="mt-3 text-[#241C15]/65 leading-relaxed">{it.description}</p>

              {/* <motion.div
                whileHover={{ x: 5 }}
                className="mt-5 flex justify-center cursor-pointer"
              >
                <span className="text-sm font-medium text-[#FFE01B] flex items-center gap-1">
                  More →
                </span>
              </motion.div> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}