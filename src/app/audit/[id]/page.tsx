'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScoreCard from '../../../components/audit/ScoreCard'
import { motion, AnimatePresence } from 'framer-motion'

type Issue = {
  title: string
  solutionSteps?: string[]
  description?: string
  impact?: string
  element?: string
  recommendation?: string
}

// Your Original Color Palette - preserved exactly
const colors = {
  primary: '#f7af00',      // Gold - for accents only
  light: '#faf4e5',        // Light cream
  lighter: '#f0eadd',      // Lighter cream
  dark: '#050504',         // Near black
  gray: '#31302f',         // Dark gray
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function AuditPage() {
  const params = useParams()
  const router = useRouter()

  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'critical' | 'high' | 'medium' | 'low'>('critical')
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    fetchAudit()
  }, [])

  async function fetchAudit() {
    const res = await fetch(`/api/audit-tools/audit/${params.id}`)
    const data = await res.json()
    setAudit(data)
    setLoading(false)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center px-4">
          <div
            className="animate-spin h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 mx-auto mb-4"
            style={{ borderColor: colors.lighter, borderTopColor: colors.primary }}
          />
          <p className="text-sm sm:text-base" style={{ color: colors.gray }}>Loading your audit results...</p>
        </div>
      </div>
    )

  if (!audit)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center py-20 px-4 max-w-md mx-auto">
          <p style={{ color: colors.dark }} className="text-lg sm:text-xl font-semibold mb-2">
            Audit not found
          </p>
          <p style={{ color: colors.gray }} className="text-sm sm:text-base mb-6">
            The audit you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/audit')}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            style={{
              backgroundColor: colors.primary,
              color: colors.dark
            }}
          >
            Start New Audit
          </button>
        </div>
      </div>
    )

  // Safely access nested properties with fallbacks
  const issues = audit.issues?.[tab] || []
  const scores = audit.scores || {}
  const store = audit.store || {}
  const aiSummary = audit.aiSummary || ''
  const estimatedImpact = audit.estimatedImpact || {}
  const priorityActions = audit.priorityActions || []
  const quickWins = audit.quickWins || []
  const recommendations = audit.recommendations || {}
  const metrics = audit.metrics || {}
  const performanceMetrics = metrics.performance || {}

  const getSeverityColor = (severity: string) => {
    const severityMap: { [key: string]: { bg: string; border: string; text: string } } = {
      critical: { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' },
      high: { bg: '#fed7aa', border: '#fdba74', text: '#92400e' },
      medium: { bg: '#fef3c7', border: '#fcd34d', text: '#78350f' },
      low: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534' },
    }
    return severityMap[severity] || severityMap.low
  }

  const severityColor = getSeverityColor(tab)

  // Flatten recommendations from all severity levels
  const getAllRecommendations = () => {
    const allRecs: string[] = []
    if (recommendations) {
      Object.values(recommendations).forEach((recs: any) => {
        if (Array.isArray(recs)) {
          allRecs.push(...recs)
        }
      })
    }
    return allRecs
  }

  // Format text with proper line breaks and spacing
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>

      {/* ================= HERO SECTION ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.lighter,
          borderBottom: `1px solid ${colors.lighter}`
        }}
      >
        {/* Decorative accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: colors.primary }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">

          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">

            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {/* Store Name Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4"
                style={{ backgroundColor: colors.light }}
              >
                <span className="text-sm sm:text-base" style={{ color: colors.primary }}>🏪</span>
                <span className="text-xs sm:text-sm font-medium truncate max-w-[200px] sm:max-w-none" style={{ color: colors.dark }}>
                  {store.name || 'Your Store'}
                </span>
              </div>

              {/* Main Headline - from database */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">
                <span style={{ color: colors.dark }}>Store Performance</span>
                <br className="hidden sm:block" />
                <span style={{ color: colors.primary }}>Audit Report</span>
              </h1>

              {/* Subheadline - from database */}
              <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-2xl leading-relaxed" style={{ color: colors.gray }}>
                {aiSummary ? aiSummary.substring(0, 120) + '...' : 'Comprehensive analysis of your store\'s performance metrics'}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-base" style={{ color: colors.primary }}>📅</span>
                  <span className="text-xs sm:text-sm" style={{ color: colors.gray }}>
                    {audit.completedAt ? new Date(audit.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Date not available'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-base" style={{ color: colors.primary }}>🌐</span>
                  <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]" style={{ color: colors.gray }}>
                    {store.url || 'URL not available'}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.light }}
                >
                  <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>✓</span>
                  <span className="text-xs font-medium" style={{ color: colors.gray }}>
                    {audit.status || 'Completed'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => router.push('/audit')}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
                  style={{
                    backgroundColor: colors.lighter,
                    color: colors.gray
                  }}
                >
                  <span className="text-base sm:text-lg">↻</span>
                  New Audit
                </button>
              </div>

              {/* Share Menu Dropdown */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-48 rounded-lg shadow-lg z-10"
                    style={{ backgroundColor: colors.light, border: `1px solid ${colors.lighter}` }}
                  >
                    <div className="py-2">
                      {['Copy Link', 'Email Report', 'Download PDF'].map((option) => (
                        <button
                          key={option}
                          className="w-full text-left px-4 py-2 text-sm transition-colors"
                          style={{ color: colors.dark }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.lighter)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          onClick={() => setShowShareMenu(false)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Column - Overall Score */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 mx-auto lg:mx-0"
            >
              <div
                className="p-4 sm:p-6 rounded-2xl text-center"
                style={{ backgroundColor: colors.light }}
              >
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3"
                  style={{
                    background: `conic-gradient(${colors.primary} ${(scores.overall || 0) * 3.6}deg, ${colors.lighter} 0deg)`
                  }}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.light }}
                  >
                    <span className="text-2xl sm:text-3xl font-bold" style={{ color: colors.primary }}>
                      {scores.overall || 0}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium" style={{ color: colors.gray }}>Overall Score</p>
                <p className="text-xs mt-1" style={{ color: colors.gray }}>
                  {(scores.overall || 0) >= 80 ? 'Excellent' :
                    (scores.overall || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 space-y-6 md:space-y-8">

        {/* Score Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
        >
          <motion.div variants={itemVariants}><ScoreCard score={scores.overall || 0} label="Overall" /></motion.div>
          <motion.div variants={itemVariants}><ScoreCard score={scores.performance || 0} label="Performance" /></motion.div>
          <motion.div variants={itemVariants}><ScoreCard score={scores.seo || 0} label="SEO" /></motion.div>
          <motion.div variants={itemVariants}><ScoreCard score={scores.ux || 0} label="UX" /></motion.div>
          <motion.div variants={itemVariants}><ScoreCard score={scores.conversion || 0} label="Conversion" /></motion.div>
          <motion.div variants={itemVariants}><ScoreCard score={scores.trust || 0} label="Trust" /></motion.div>
        </motion.div>

        {/* Performance Metrics Section - using metrics.performance */}
        {performanceMetrics && Object.keys(performanceMetrics).length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl p-4 sm:p-5 md:p-6"
            style={{ backgroundColor: colors.lighter }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <h2 className="font-semibold text-base sm:text-lg" style={{ color: colors.dark }}>
                ⚡ Performance Metrics
              </h2>
              <span className="text-xs px-2 py-1 rounded-full w-fit" style={{ backgroundColor: colors.light, color: colors.gray }}>
                Real-time data
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {performanceMetrics.loadTime !== undefined && (
                <MetricCard label="Load Time" value={`${(performanceMetrics.loadTime / 1000).toFixed(1)}s`} />
              )}
              {performanceMetrics.largestContentfulPaint !== undefined && (
                <MetricCard label="LCP" value={`${performanceMetrics.largestContentfulPaint.toFixed(0)}ms`} />
              )}
              {performanceMetrics.cumulativeLayoutShift !== undefined && (
                <MetricCard label="CLS" value={performanceMetrics.cumulativeLayoutShift} />
              )}
              {performanceMetrics.totalBlockingTime !== undefined && (
                <MetricCard label="TBT" value={`${performanceMetrics.totalBlockingTime}ms`} />
              )}
              {performanceMetrics.speedIndex !== undefined && (
                <MetricCard label="Speed Index" value={`${performanceMetrics.speedIndex.toFixed(0)}ms`} />
              )}
            </div>
          </motion.div>
        )}

        {/* Issues Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: colors.lighter }}
        >
          {/* Section Header */}
          <div className="p-4 sm:p-5 md:p-6 border-b" style={{ borderColor: colors.light }}>
            <h2 className="font-semibold text-base sm:text-lg mb-3" style={{ color: colors.dark }}>
              🔍 Issues Found
            </h2>

            {/* Severity Tabs - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
                const count = audit.issues?.[severity]?.length || 0
                const colors = getSeverityColor(severity)

                return (
                  <button
                    key={severity}
                    onClick={() => setTab(severity)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all ${tab === severity ? 'shadow-md scale-105 ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
                      }`}
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="capitalize">{severity}</span>
                      <span className="font-bold mt-0.5">{count}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Issues List */}
          <div className="p-4 sm:p-5 md:p-6">
            <AnimatePresence mode="wait">
              {issues.length > 0 ? (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  {issues.map((issue: Issue, i: number) => {
                    const severityColors = getSeverityColor(tab)

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-lg overflow-hidden cursor-pointer"
                        style={{
                          backgroundColor: severityColors.bg,
                          border: `1px solid ${severityColors.border}`
                        }}
                        onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                      >
                        {/* Issue Header */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm sm:text-base leading-snug" style={{ color: severityColors.text }}>
                                {issue.title}
                              </h3>

                              {/* Quick Info Tags */}
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                {issue.impact && (
                                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: severityColors.bg }}>
                                    Impact: {issue.impact}
                                  </span>
                                )}
                                {issue.element && (
                                  <span className="text-xs px-2 py-1 rounded-full font-mono truncate max-w-[150px]" style={{ backgroundColor: severityColors.bg }}>
                                    {issue.element}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-lg sm:text-xl font-bold" style={{ color: severityColors.text }}>
                              {expandedIssue === i ? '−' : '+'}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedIssue === i && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-3" style={{ borderTop: `1px solid ${severityColors.border}` }}>

                                {issue.description && (
                                  <div className="mt-3">
                                    <p className="text-xs font-semibold mb-1" style={{ color: severityColors.text }}>
                                      Description
                                    </p>
                                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: severityColors.text }}>
                                      {formatText(issue.description)}
                                    </p>
                                  </div>
                                )}

                                {issue.solutionSteps && issue.solutionSteps.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold mb-2" style={{ color: severityColors.text }}>
                                      Solution Steps:
                                    </p>
                                    <ul className="space-y-2">
                                      {issue.solutionSteps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ backgroundColor: severityColors.bg, color: severityColors.text }}
                                          >
                                            {idx + 1}
                                          </span>
                                          <span className="leading-relaxed" style={{ color: severityColors.text }}>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {issue.recommendation && (
                                  <div className="mt-2 p-3 rounded" style={{ backgroundColor: severityColors.bg }}>
                                    <p className="text-xs font-semibold mb-1" style={{ color: severityColors.text }}>
                                      Recommendation
                                    </p>
                                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: severityColors.text }}>
                                      {formatText(issue.recommendation)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <p className="text-sm sm:text-base" style={{ color: colors.gray }}>
                    No {tab} severity issues found. Great job! 🎉
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Wins & Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

          {/* Quick Wins */}
          {quickWins.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-4 sm:p-5 md:p-6"
              style={{ backgroundColor: '#dcfce7' }}
            >
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2" style={{ color: '#166534' }}>
                <span className="text-lg sm:text-xl">⚡</span>
                Quick Wins
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {quickWins.map((win: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed"
                    style={{ color: '#166534' }}
                  >
                    <span className="flex-shrink-0 font-bold">✓</span>
                    <span>{win}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Recommendations */}
          {getAllRecommendations().length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-4 sm:p-5 md:p-6"
              style={{ backgroundColor: colors.lighter }}
            >
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                <span className="text-lg sm:text-xl">🎯</span>
                Recommendations
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {getAllRecommendations().map((rec: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded leading-relaxed"
                    style={{ color: colors.dark, backgroundColor: colors.light }}
                  >
                    <span className="flex-shrink-0 font-bold" style={{ color: colors.primary }}>→</span>
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Priority Actions & Impact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">

          {/* Priority Actions */}
          {priorityActions.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 rounded-xl p-4 sm:p-5 md:p-6"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2" style={{ color: '#78350f' }}>
                <span className="text-lg sm:text-xl">🔥</span>
                Priority Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {priorityActions.map((action: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 p-3 sm:p-4 rounded-lg text-xs sm:text-sm leading-relaxed"
                    style={{ backgroundColor: '#fffbeb', color: '#78350f' }}
                  >
                    <span className="flex-shrink-0 font-bold">{i + 1}.</span>
                    <span>{action}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Estimated Impact */}
          {estimatedImpact && Object.keys(estimatedImpact).length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-4 sm:p-5 md:p-6"
              style={{ backgroundColor: colors.lighter }}
            >
              <h2 className="font-semibold text-base sm:text-lg mb-4" style={{ color: colors.dark }}>
                📊 Estimated Impact
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {Object.entries(estimatedImpact).map(([key, value]: [string, any], i) => {
                  // Extract percentage from string like "Increase by 5-8%"
                  const percentageMatch = String(value).match(/(\d+)(?:-(\d+))?%/);
                  let percentage = 0;
                  if (percentageMatch) {
                    if (percentageMatch[2]) {
                      // Range like 5-8% - take average
                      percentage = (parseInt(percentageMatch[1]) + parseInt(percentageMatch[2])) / 2;
                    } else {
                      percentage = parseInt(percentageMatch[1]);
                    }
                  }

                  return (
                    <div key={i}>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mb-1 gap-1">
                        <span className="capitalize" style={{ color: colors.gray }}>
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <span className="font-medium" style={{ color: colors.dark }}>{value}</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.light }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl p-4 sm:p-5 md:p-6"
            style={{ backgroundColor: colors.lighter }}
          >
            <h2 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2" style={{ color: colors.dark }}>
              <span className="text-lg sm:text-xl">💡</span>
              AI Summary
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.gray }}>
              {formatText(aiSummary)}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5">
              <div className="text-center p-2 sm:p-3 rounded" style={{ backgroundColor: colors.light }}>
                <p className="text-xs sm:text-sm" style={{ color: colors.gray }}>Issues Found</p>
                <p className="text-base sm:text-lg font-bold" style={{ color: colors.dark }}>
                  {Object.values(audit.issues || {}).flat().length}
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded" style={{ backgroundColor: colors.light }}>
                <p className="text-xs sm:text-sm" style={{ color: colors.gray }}>Quick Wins</p>
                <p className="text-base sm:text-lg font-bold" style={{ color: colors.dark }}>
                  {quickWins.length}
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded" style={{ backgroundColor: colors.light }}>
                <p className="text-xs sm:text-sm" style={{ color: colors.gray }}>Critical</p>
                <p className="text-base sm:text-lg font-bold" style={{ color: '#991b1b' }}>
                  {audit.issues?.critical?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Helper component for metric cards
function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-lg p-2 sm:p-3 text-center"
      style={{ backgroundColor: colors.light }}
    >
      <p className="text-xs font-medium mb-1 truncate" style={{ color: colors.gray }}>
        {label}
      </p>
      <p className="text-sm sm:text-base font-bold" style={{ color: colors.dark }}>
        {value}
      </p>
    </div>
  )
}