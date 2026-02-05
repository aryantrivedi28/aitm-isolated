'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScoreCard from '../../../components/audit/ScoreCard'
import { motion } from 'framer-motion'

type Issue = {
  title: string
  solutionSteps?: string[]
  description?: string
}

// Color Palette
const colors = {
  primary: '#f7af00',      // Gold - for accents only
  light: '#faf4e5',        // Light cream
  lighter: '#f0eadd',      // Lighter cream
  dark: '#050504',         // Near black
  gray: '#31302f',         // Dark gray
}

export default function AuditPage() {
  const params = useParams()
  const router = useRouter()

  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'critical' | 'high' | 'medium' | 'low'>('critical')
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)

  useEffect(() => {
    fetchAudit()
  }, [])

  async function fetchAudit() {
    const res = await fetch(`/api/audit-tools/audit/${params.id}`)
    const data = await res.json()
    console.log('Fetched audit data:', data)
    setAudit(data)
    setLoading(false)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div
          className="animate-spin h-12 w-12 rounded-full border-4 border-gray-300"
          style={{ borderTopColor: colors.dark }}
        />
      </div>
    )

  if (!audit)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center py-20">
          <p style={{ color: colors.dark }} className="text-lg font-semibold">
            Audit not found
          </p>
        </div>
      </div>
    )

  const issues = audit.issues?.[tab] || []

  const Metric = ({ label, value }: any) => (
    <div
      className="rounded-lg shadow-sm p-3 md:p-4 text-center border"
      style={{ backgroundColor: colors.light, borderColor: colors.lighter }}
    >
      <p className="text-xs md:text-sm font-medium" style={{ color: colors.gray }}>
        {label}
      </p>
      <p
        className="text-base md:text-xl font-bold mt-1"
        style={{ color: colors.dark }}
      >
        {value}
      </p>
    </div>
  )

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

  return (
    <div
      className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: colors.light }}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border"
          style={{ backgroundColor: '#f0eadd', borderColor: colors.lighter }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold truncate"
                style={{ color: colors.dark }}
              >
                {audit.store_name || 'Store'}
              </h1>
              <p
                className="text-xs sm:text-sm mt-1 truncate"
                style={{ color: colors.gray }}
              >
                {audit.store_url}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs" style={{ color: colors.gray }}>
                  Theme: <span style={{ color: colors.dark }} className="font-medium">{audit.shopify_theme}</span>
                </p>
                <p className="text-xs" style={{ color: colors.gray }}>
                  Completed: <span style={{ color: colors.dark }} className="font-medium">
                    {new Date(audit.completedAt).toLocaleDateString()} {new Date(audit.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 items-center justify-end flex-wrap">
              <div
                className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold"
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534'
                }}
              >
                {audit.status}
              </div>
              <button
                onClick={() => router.push('/audit')}
                className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  color: colors.dark,
                  backgroundColor: colors.lighter
                }}
              >
                ↻ New Audit
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= SCORE GRID ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
        >
          <ScoreCard score={audit.scores.overall} label="Overall" />
          <ScoreCard score={audit.scores.performance} label="Performance" />
          <ScoreCard score={audit.scores.seo} label="SEO" />
          <ScoreCard score={audit.scores.ux} label="UX" />
          <ScoreCard score={audit.scores.conversion} label="Conversion" />
          <ScoreCard score={audit.scores.trust} label="Trust" />
        </motion.div>

        {/* ================= PERFORMANCE METRICS ================= */}
        {audit.raw_metrics?.performance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="font-medium text-base sm:text-lg md:text-xl mb-3 md:mb-4"
              style={{ color: colors.dark }}
            >
              ⚡ Performance Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              <Metric label="Load Time" value={`${audit.raw_metrics.performance.loadTime.toFixed(0)} ms`} />
              <Metric label="LCP" value={`${audit.raw_metrics.performance.largestContentfulPaint.toFixed(0)} ms`} />
              <Metric label="CLS" value={audit.raw_metrics.performance.cumulativeLayoutShift} />
              <Metric label="TBT" value={`${audit.raw_metrics.performance.totalBlockingTime} ms`} />
              <Metric label="Speed Index" value={`${audit.raw_metrics.performance.speedIndex.toFixed(0)} ms`} />
            </div>
          </motion.div>
        )}

        {/* ================= ISSUES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border"
          style={{ backgroundColor: '#f0eadd', borderColor: colors.lighter }}
        >
          <h2
            className="font-bold text-base sm:text-lg md:text-xl mb-4 md:mb-6"
            style={{ color: colors.dark }}
          >
            🔍 Issues
          </h2>

          {/* tabs */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6 overflow-x-auto">
            {(['critical', 'high', 'medium', 'low'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${tab === t ? 'shadow-md scale-105' : 'hover:scale-105'
                  }`}
                style={{
                  backgroundColor: tab === t ? severityColor.bg : colors.lighter,
                  color: tab === t ? severityColor.text : colors.gray,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: tab === t ? severityColor.border : colors.lighter,
                }}
              >
                {t.toUpperCase()}
                <span className="ml-1 font-bold">({audit.issues?.[t]?.length || 0})</span>
              </button>
            ))}
          </div>

          {/* issue cards */}
          <div className="space-y-2 md:space-y-3">
            {issues.length > 0 ? (
              issues.map((issue: Issue, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg p-3 md:p-4 border cursor-pointer transition-all hover:shadow-md"
                  style={{
                    backgroundColor: severityColor.bg,
                    borderColor: severityColor.border,
                    borderWidth: '1px',
                  }}
                  onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p
                      className="font-semibold text-sm md:text-base flex-1"
                      style={{ color: severityColor.text }}
                    >
                      {issue.title}
                    </p>
                    <span
                      className="text-xl flex-shrink-0"
                      style={{ color: severityColor.text }}
                    >
                      {expandedIssue === i ? '−' : '+'}
                    </span>
                  </div>

                  {expandedIssue === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-2"
                    >
                      {issue.description && (
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: severityColor.text }}
                        >
                          {issue.description}
                        </p>
                      )}

                      {issue.solutionSteps && issue.solutionSteps.length > 0 && (
                        <div>
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: severityColor.text }}
                          >
                            Solution Steps:
                          </p>
                          <ul className="text-xs space-y-1 pl-4">
                            {issue.solutionSteps.map((s, idx) => (
                              <li
                                key={idx}
                                style={{ color: severityColor.text }}
                              >
                                • {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 md:py-8">
                <p
                  className="text-sm md:text-base"
                  style={{ color: colors.gray }}
                >
                  No {tab} severity issues found. Great job! 🎉
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ================= QUICK WINS ================= */}
        {audit.quick_wins?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl md:rounded-2xl p-4 md:p-6 border"
            style={{
              backgroundColor: '#dcfce7',
              borderColor: '#bbf7d0',
              borderWidth: '1px',
            }}
          >
            <h2
              className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4 flex items-center gap-2"
              style={{ color: '#166534' }}
            >
              ⚡ Quick Wins
            </h2>
            <ul className="space-y-1 md:space-y-2">
              {audit.quick_wins.map((q: string, i: number) => (
                <li
                  key={i}
                  className="text-xs sm:text-sm flex gap-2"
                  style={{ color: '#166534' }}
                >
                  <span className="flex-shrink-0 font-bold">✓</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ================= RECOMMENDATIONS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border"
          style={{ backgroundColor: '#f0eadd', borderColor: colors.lighter }}
        >
          <h2
            className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4 flex items-center gap-2"
            style={{ color: colors.dark }}
          >
            🎯 Recommendations
          </h2>
          <ul className="space-y-2 md:space-y-3">
            {audit.recommendations.map((r: string, i: number) => (
              <li
                key={i}
                className="text-xs sm:text-sm flex gap-3 p-2 rounded-lg"
                style={{ color: colors.dark, backgroundColor: colors.light }}
              >
                <span
                  className="flex-shrink-0 font-bold"
                  style={{ color: colors.primary }}
                >
                  →
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ================= PRIORITY ACTIONS ================= */}
        {audit.priority_actions?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border"
            style={{
              backgroundColor: '#fef3c7',
              borderColor: '#fcd34d',
              borderWidth: '1px',
            }}
          >
            <h2
              className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4"
              style={{ color: '#78350f' }}
            >
              🔥 Priority Actions
            </h2>
            <ul className="space-y-2 md:space-y-3">
              {audit.priority_actions.map((p: string, i: number) => (
                <li
                  key={i}
                  className="text-xs sm:text-sm flex gap-3 p-2 rounded-lg"
                  style={{ color: '#78350f', backgroundColor: '#fffbeb' }}
                >
                  <span className="flex-shrink-0 font-bold">⚡</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ================= IMPACT ================= */}
        {audit.estimated_impact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          >
            {Object.entries(audit.estimated_impact).map(([k, v], i) => (
              <Metric key={i} label={k} value={v} />
            ))}
          </motion.div>
        )}

        {/* ================= AI SUMMARY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border"
          style={{ backgroundColor: '#f0eadd', borderColor: colors.lighter }}
        >
          <h2
            className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4"
            style={{ color: colors.dark }}
          >
            💡 AI Summary
          </h2>
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: colors.gray }}
          >
            {audit.ai_summary}
          </p>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-4 md:h-6" />
      </div>
    </div>
  )
}