'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function SectionWrapper({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`py-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </motion.section>
  )
}
