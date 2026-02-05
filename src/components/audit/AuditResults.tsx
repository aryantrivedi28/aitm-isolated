'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ScoreCard from './ScoreCard'
import IssueCard from './IssueCard'
import ChartRadar from './ChartRadar'
import ChartBar from './ChartBar'

interface AuditResultsProps {
  audit: any
}

export default function AuditResults({ audit }: AuditResultsProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)

  const chartData = {
    scores: {
      performance: audit.performance_score,
      seo: audit.seo_score,
      ux: audit.ux_score,
      conversion: audit.conversion_score,
      trust: audit.trust_score
    }
  }

  const issuesBySeverity = {
    critical: audit.critical_issues || [],
    high: audit.high_issues || [],
    medium: audit.medium_issues || [],
    low: audit.low_issues || []
  }

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <ScoreCard score={audit.overall_score} />

      {/* Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(chartData.scores).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow p-4 text-center"
          >
            <div className="text-sm text-gray-500 mb-1 capitalize">{key}</div>
            <div className={`text-2xl font-bold ${
              value >= 80 ? 'text-green-600' :
              value >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {value}/100
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar</h3>
          <ChartRadar data={chartData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
          <ChartBar data={chartData} />
        </div>
      </div>

      {/* Critical Issues */}
      {issuesBySeverity.critical.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden"
        >
          <div className="bg-red-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center">
              🚨 Critical Issues ({issuesBySeverity.critical.length})
            </h2>
            <p className="text-red-100 text-sm mt-1">
              Fix these immediately as they significantly impact store performance
            </p>
          </div>
          <div className="p-6 space-y-4">
            {issuesBySeverity.critical.map((issue: any, index: number) => (
              <IssueCard
                key={issue.id || index}
                issue={issue}
                severity="critical"
                isExpanded={expandedIssue === issue.id}
                onToggle={() => setExpandedIssue(
                  expandedIssue === issue.id ? null : issue.id
                )}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* High Priority Issues */}
      {issuesBySeverity.high.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl overflow-hidden"
        >
          <div className="bg-orange-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center">
              ⚠️ High Priority Issues ({issuesBySeverity.high.length})
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              Address these soon to improve user experience and conversions
            </p>
          </div>
          <div className="p-6 space-y-4">
            {issuesBySeverity.high.map((issue: any, index: number) => (
              <IssueCard
                key={issue.id || index}
                issue={issue}
                severity="high"
                isExpanded={expandedIssue === issue.id}
                onToggle={() => setExpandedIssue(
                  expandedIssue === issue.id ? null : issue.id
                )}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          🤖 AI-Powered Recommendations
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-gray-700">{audit.ai_summary}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Priority Actions</h3>
          <ul className="space-y-2">
            {(audit.priority_actions || []).map((action: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-800">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {audit.estimated_impact && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Estimated Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {audit.estimated_impact.conversionRate || '+1.5-3.2%'}
                </div>
                <div className="text-sm text-gray-600">Conversion Rate Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {audit.estimated_impact.aovIncrease || '+$15-30'}
                </div>
                <div className="text-sm text-gray-600">Average Order Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {audit.estimated_impact.revenuePotential || '25-40%'}
                </div>
                <div className="text-sm text-gray-600">Revenue Potential</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}