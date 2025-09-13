'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import { Clock, Layers } from 'lucide-react'

const defaultIcons = [Clock, Layers]

interface PainPointsProps {
  heading?: string
  items?: {
    title: string
    description: string
    icon?: any // Sanity image
  }[]
}

export default function PainPoints({ heading, items = [] }: PainPointsProps) {
  return (
    <section className="bg-[#241C15] py-20 text-white">
      <div className="max-w-6xl mx-auto px-6">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-extrabold text-center capitalize">
            {heading}
          </h2>
        )}

        <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-3">
          {items.map((p, i) => {
            const DefaultIcon = defaultIcons[i % defaultIcons.length] 

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative bg-[#2F2A23] p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-transparent hover:border-[#FFE01B]/40"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-12 bg-gradient-to-br from-[#FFE01B] to-[#FFD700]/80 shadow-lg overflow-hidden">
                  {p.icon ? (
                    <Image
                      src={urlFor(p.icon).url()}
                      alt={p.title}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  ) : (
                    <DefaultIcon className="w-7 h-7 text-black" />
                  )}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-center text-white capitalize">
                  {p.title}
                </h3>
                <p className="mt-3 text-gray-300 text-center">{p.description}</p>

                <div className="mt-6 text-center">
                  <a className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full border border-gray-600 hover:bg-[#FFE01B] hover:text-black transition-colors">
                    Learn more
                  </a>
                </div>

                {/* glowing accent */}
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-70 transition-opacity">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="16" stroke="#FFE01B" strokeOpacity="0.3" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
