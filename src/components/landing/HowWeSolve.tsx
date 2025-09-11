'use client'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, DollarSign, User } from 'lucide-react'

const ICONS = { CheckCircle, Clock, DollarSign, User }

interface Item {
  icon?: keyof typeof ICONS | string
  title: string
  description: string
}

export default function HowWeSolve({ heading, items = [] }: { heading?: string; items?: Item[] }) {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Animated background blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 text-center relative">
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((it, i) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS] || CheckCircle
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="p-8 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 200 }}
                  className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-[#FFE01B]/20 ring-4 ring-[#FFE01B]/40"
                >
                  <Icon className="w-9 h-9 text-[#FFE01B]" />
                </motion.div>

                <h3 className="mt-6 text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {it.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{it.description}</p>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="mt-5 flex justify-center cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#FFE01B] flex items-center gap-1">
                    More →
                  </span>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
