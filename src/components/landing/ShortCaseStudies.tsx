'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { urlFor } from '@/src/sanity/lib/image'

interface CaseStudy {
  slug?: { current?: string }
  image?: any
  company?: string
  result?: string
  tags?: string[]
}

export default function ShortCaseStudies({ heading, studies = [] }: { heading?: string; studies?: CaseStudy[] }) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {heading && <h2 className="text-3xl md:text-4xl font-extrabold text-center">{heading}</h2>}

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {studies.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg group"
            >
              <Link href={`/case-studies/${c.slug?.current || ''}`}>
                <div className="relative w-full h-48">
                  {c.image ? (
                    <Image src={urlFor(c.image).url()} alt={c.company || ''} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">No image</div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{c.company}</h3>
                    <div className="text-sm text-gray-500">{c.tags?.[0]}</div>
                  </div>
                  <p className="mt-3 text-gray-600">{c.result}</p>
                  <div className="mt-4">
                    {c.tags?.map((t, idx) => (
                      <span key={idx} className="inline-block text-sm mr-2 px-3 py-1 rounded-full bg-gray-100 text-[#241C15]">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
