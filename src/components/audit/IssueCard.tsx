'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IssueCardProps {
  issue: any
  severity: 'critical' | 'high' | 'medium' | 'low'
  isExpanded: boolean
  onToggle: () => void
}

export default function IssueCard({ issue, severity, isExpanded, onToggle }: IssueCardProps) {
  const severityConfig = {
    critical: {
      color: 'bg-red-100 text-red-800 border-red-300',
      badge: '🔥 Critical',
      icon: '🚨'
    },
    high: {
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      badge: '⚠️ High',
      icon: '⚠️'
    },
    medium: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      badge: '🔄 Medium',
      icon: '🔄'
    },
    low: {
      color: 'bg-green-100 text-green-800 border-green-300',
      badge: '📝 Low',
      icon: '📝'
    }
  }

  const config = severityConfig[severity]

  return (
    <div className={`border rounded-xl ${config.color} overflow-hidden`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{config.icon}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.badge}
              </span>
              <span className="text-xs text-gray-600 capitalize">
                {issue.category || 'General'}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
            <p className="text-gray-700 mt-1">{issue.description}</p>
            
            {issue.metric && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current: </span>
                  <span className="font-semibold">{issue.metric.value} {issue.metric.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">Target: </span>
                  <span className="font-semibold">{issue.metric.target}</span>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onToggle}
            className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Business Impact</h4>
                <p className="text-gray-700">{issue.businessImpact}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Solution</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {issue.solutionSteps?.map((step: string, idx: number) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  ))}
                </ul>
              </div>

              {issue.codeExamples && issue.codeExamples.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-100 mb-2">Code Example</h4>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {issue.codeExamples[0]}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Fix Priority</div>
                  <div className="font-semibold">{issue.fixPriority || 'Medium'}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Estimated Time</div>
                  <div className="font-semibold">{issue.estimatedTime || '1-2 hours'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}