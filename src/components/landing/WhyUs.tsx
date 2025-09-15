'use client'
import { motion } from 'framer-motion'
import { Check, TrendingUp, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'

export default function WhyUs({
  heading,
  features = [], // now this is an array of objects {title,description,icon}
  stats = [],
}: {
  heading?: string
  features?: { title: string; description: string; icon?: { asset?: { url?: string } } }[]
  stats?: { label: string; value: string }[]
}) {
  return (
    <section className="relative bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811] py-24 text-white overflow-hidden w-full">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/5 via-transparent to-transparent opacity-80" />

        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 224, 27, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 60px 60px'
          }}
        />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-[#FFE01B]/20 rounded-full"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-1 h-1 bg-[#FFE01B]/30 rounded-full"
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />

        {/* Large decorative shape */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 border border-[#FFE01B]/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Enhanced heading */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#FFE01B]/10 backdrop-blur-sm border border-[#FFE01B]/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles size={16} className="text-[#FFE01B]" />
              <span className="text-sm text-[#FFE01B] font-medium">Why Choose Us</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              {heading.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B]">
                {heading.split(' ').slice(-1)}
              </span>
            </h2>

          </motion.div>
        )}

        {/* Enhanced Stats */}
        {stats.length > 0 && (
          <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFE01B]/20 to-[#FFE01B]/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative p-4 rounded-3xl bg-gradient-to-br from-white/8 to-white/2 border border-white/10 backdrop-blur-sm hover:border-[#FFE01B]/30 transition-all duration-500">
                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4">
                    <TrendingUp size={20} className="text-[#FFE01B]/40" />
                  </div>

                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, type: "spring" }}
                    className="text-4xl md:text-5xl font-black text-[#FFE01B] mb-3"
                  >
                    {s.value}
                  </motion.div>

                  <div className="text-gray-300 font-medium leading-relaxed">{s.label}</div>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FFE01B]/30 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Enhanced Features Grid */}
        {features?.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ x: 5 }}
                className="group relative"
              >
                {/* Background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative flex items-start gap-6 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/8 hover:border-[#FFE01B]/20 transition-all duration-500 backdrop-blur-sm">
                  {/* Enhanced icon container */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, type: "spring" }}
                    className="relative flex-shrink-0"
                  >
                    <div className="absolute -inset-2 bg-[#FFE01B]/20 rounded-xl blur opacity-60" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-[#FFE01B] to-[#FFF045] rounded-xl flex items-center justify-center shadow-lg">
                      {f.icon?.asset?.url ? (
                        <Image
                          src={f.icon.asset.url}
                          alt={f.title}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      ) : (
                        <Check className="w-6 h-6 text-black" />
                      )}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-xl font-bold text-white mb-2 group-hover:text-[#FFE01B] transition-colors duration-300"
                    >
                      {f.title}
                    </motion.h3>

                    {f.description && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="text-gray-300 leading-relaxed text-base"
                      >
                        {f.description}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Bottom highlight line */}
                <motion.div
                  className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#FFE01B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-2 text-[#FFE01B]/60">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                <Star size={8} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}