'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function WhyUs({ heading, features = [], stats = [] }: { heading?: string; features?: string[]; stats?: { label: string; value: string }[] }) {
  return (
    <section className="bg-[#241C15] py-20 text-white">
      <div className="max-w-6xl mx-auto px-6">
        {heading && <h2 className="text-3xl md:text-4xl font-extrabold text-center">{heading}</h2>}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(stats.length ? stats : [
            { label: 'Saved per month', value: '40h' },
            { label: 'Avg. response', value: '45 mins' },
            { label: 'Avg. ROI', value: '3.2x' },
          ]).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="p-6 rounded-2xl bg-white/5 border border-white/6"
            >
              <div className="text-3xl font-bold text-[#FFE01B]">{s.value}</div>
              <div className="mt-2 text-sm text-gray-300">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3"
            >
              <Check className="w-6 h-6 text-[#FFE01B] flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold">{f}</div>
                <div className="text-gray-300 text-sm">Trusted and proven in production</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
