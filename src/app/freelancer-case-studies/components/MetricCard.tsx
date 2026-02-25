'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  metric: {
    label: string
    value: number
    type: 'number' | 'percentage' | 'currency'
    trend?: 'up' | 'down' | 'neutral'
    previousValue?: number
  }
}

export default function MetricCard({ metric }: MetricCardProps) {
  const formatValue = () => {
    switch (metric.type) {
      case 'percentage':
        return `${metric.value}%`
      case 'currency':
        return `$${metric.value.toLocaleString()}`
      default:
        return metric.value.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendChange = () => {
    if (!metric.previousValue || !metric.trend) return null
    
    const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100
    const absChange = Math.abs(change).toFixed(1)
    
    return (
      <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {metric.trend === 'up' ? '+' : '-'}{absChange}%
      </span>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{metric.label}</span>
        {getTrendIcon()}
      </div>
      <div className="text-2xl font-bold text-gray-900">{formatValue()}</div>
      {getTrendChange() && (
        <div className="mt-1 text-xs text-gray-500">
          vs previous {getTrendChange()}
        </div>
      )}
    </div>
  )
}