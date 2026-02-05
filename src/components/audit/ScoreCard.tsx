'use client'

import { motion } from 'framer-motion'

interface ScoreCardProps {
  score: number
  label?: string
}

// Color Palette
const colors = {
  primary: '#f7af00',      // Gold - for accents only
  light: '#faf4e5',        // Light cream
  lighter: '#f0eadd',      // Lighter cream
  dark: '#050504',         // Near black
  gray: '#31302f',         // Dark gray
}

export default function ScoreCard({ score, label = 'Score' }: ScoreCardProps) {
  const radius = 45
  const stroke = 6
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = () => {
    if (score >= 80) {
      return {
        main: '#15803d',      // Green
        light: '#dcfce7',
        ring: '#86efac',
      }
    }
    if (score >= 60) {
      return {
        main: '#92400e',      // Amber
        light: '#fef3c7',
        ring: '#fcd34d',
      }
    }
    if (score >= 40) {
      return {
        main: '#b45309',      // Orange
        light: '#fed7aa',
        ring: '#fdba74',
      }
    }
    return {
      main: '#991b1b',       // Red
      light: '#fee2e2',
      ring: '#fca5a5',
    }
  }

  const getStatusLabel = () => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Improve'
    return 'Poor'
  }

  const scoreColor = getScoreColor()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center text-center border"
      style={{
        backgroundColor: '#f0eadd',
        borderColor: colors.lighter,
        borderWidth: '1px',
      }}
    >
      {/* Animated Ring with Background */}
      <div 
        className="relative flex items-center justify-center rounded-full mb-2 sm:mb-3 md:mb-4"
        style={{
          width: 'clamp(80px, 20vw, 140px)',
          height: 'clamp(80px, 20vw, 140px)',
          backgroundColor: scoreColor.light,
          padding: '2px',
        }}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
          }}
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Animated progress circle */}
          <motion.circle
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            stroke={scoreColor.main}
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference, rotate: -90 }}
            animate={{ strokeDashoffset, rotate: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{ transformOrigin: '50% 50%' }}
          />
        </svg>

        {/* Score text - centered in circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-bold"
            style={{
              color: scoreColor.main,
              fontSize: 'clamp(18px, 5vw, 32px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {score}
          </motion.span>
          <span
            className="text-xs md:text-xs font-medium mt-0.5"
            style={{ color: scoreColor.main }}
          >
            /100
          </span>
        </div>
      </div>

      {/* Label */}
      <motion.p
        className="text-xs sm:text-sm font-bold mt-2 sm:mt-3 truncate"
        style={{ color: colors.dark }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.p>

      {/* Status Badge */}
      <motion.div
        className="mt-2 sm:mt-2.5 px-2.5 sm:px-3 py-1 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: scoreColor.light,
          border: `1px solid ${scoreColor.ring}`,
        }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: scoreColor.main }}
        >
          {getStatusLabel()}
        </span>
      </motion.div>

      {/* Progress indicator text */}
      <motion.p
        className="text-xs mt-2 sm:mt-2.5"
        style={{ color: colors.gray }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span style={{ color: scoreColor.main, fontWeight: 600 }}>
          {score}%
        </span>
        {' '}score
      </motion.p>
    </motion.div>
  )
}