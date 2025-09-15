'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Testimonial {
  quote: string
  authorName: string
  authorTitle?: string
  authorImage?: { asset?: { url?: string } }
}

export default function TestimonialSection({
  heading,
  testimonials = [],
}: {
  heading?: string
  testimonials?: Testimonial[]
}) {
  return (
    <section className="bg-[#241C15] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {heading && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4"
          >
            {heading}
          </motion.h2>
        )}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 flex flex-col transition-all duration-300 group border border-gray-200"
            >
              {/* Quote icon */}
              <div className="mb-6 text-[#FFE01B]">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </div>

              {/* Quote text */}
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8 flex-1">"{t.quote}"</p>

              {/* Author info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                {t.authorImage?.asset?.url ? (
                  <div className="relative">
                    <Image
                      src={t.authorImage.asset.url}
                      alt={t.authorName}
                      width={56}
                      height={56}
                      className="rounded-full object-cover border-2 border-[#FFE01B] group-hover:border-[#FCD34D] transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#FFE01B] rounded-full p-1">
                      <svg className="w-4 h-4 text-[#241C15]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-[#241C15]">{t.authorName}</div>
                  {t.authorTitle && (
                    <div className="text-sm text-[#4B5563] mt-1">{t.authorTitle}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}