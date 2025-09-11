'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/src/sanity/lib/image'

interface Logo {
  asset?: any
  alt?: string
}

export default function Logos({ heading, logos = [] }: { heading?: string; logos?: Logo[] }) {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {heading && <h3 className="text-center text-xl font-semibold mb-6">{heading}</h3>}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {logos.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="w-32 h-16 relative filter grayscale hover:grayscale-0 transition-all"
            >
              {l.asset ? (
                <Image src={urlFor(l.asset).url()} alt={l.alt || 'logo'} fill className="object-contain" />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">Logo</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
