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

export default function ShortCaseStudies({
  heading,
  studies = [],
}: {
  heading?: string
  studies?: CaseStudy[]
}) {
  return (
    <section className="bg-[#241C15] py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-12">
            {heading}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {studies.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-200"
            >
              <Link href={`/case-studies/${c.slug?.current || ''}`} className="flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  {c.image ? (
                    <Image
                      src={urlFor(c.image).url()}
                      alt={c.company || ''}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 md:p-6">
                  {/* Header with Company and Tag */}
                  <div className="flex flex-col gap-2 mb-3">
                    <h3 className="text-xl font-bold text-[#241C15] line-clamp-1">
                      {c.company || 'Untitled'}
                    </h3>
                    {c.tags?.[0] && (
                      <span className="text-sm font-medium text-[#4B5563] bg-gray-100 rounded-full px-3 py-1 self-start">
                        {c.tags[0]}
                      </span>
                    )}
                  </div>

                  {/* Result Summary */}
                  {c.result && (
                    <p className="text-[#4B5563] line-clamp-3 mb-4 leading-relaxed">
                      {c.result}
                    </p>
                  )}

                  {/* Additional Tags */}
                  {c.tags && c.tags.length > 1 && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {c.tags.slice(1, 4).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-block text-xs px-3 py-1.5 rounded-full bg-[#FFE01B] text-[#241C15] font-medium hover:bg-[#FCD34D] transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                        {c.tags.length > 4 && (
                          <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-gray-100 text-[#4B5563]">
                            +{c.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-5 pt-3 border-t border-gray-200">
                    <span className="inline-flex items-center text-sm font-semibold text-[#241C15] hover:text-[#FFE01B] transition-colors">
                      View Case Study
                      <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {studies.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="inline-flex items-center px-8 py-3 bg-[#FFE01B] text-[#241C15] font-semibold rounded-lg hover:bg-[#FCD34D] transition-colors shadow-md hover:shadow-lg"
            >
              View All Case Studies
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}