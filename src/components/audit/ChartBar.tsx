'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface ChartBarProps {
  data: {
    scores: {
      performance: number
      seo: number
      ux: number
      conversion: number
      trust: number
    }
  }
}

export default function ChartBar({ data }: ChartBarProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Performance', 'SEO', 'UX', 'Conversion', 'Trust'],
        datasets: [
          {
            label: 'Your Score',
            data: [
              data.scores.performance,
              data.scores.seo,
              data.scores.ux,
              data.scores.conversion,
              data.scores.trust
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(139, 92, 246)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 1
          },
          {
            label: 'Target (80+)',
            data: [80, 80, 80, 80, 80],
            backgroundColor: 'rgba(156, 163, 175, 0.3)',
            borderColor: 'rgb(156, 163, 175)',
            borderWidth: 1,
            borderDash: [5, 5],
            type: 'line',
            pointRadius: 0
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score (0-100)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}