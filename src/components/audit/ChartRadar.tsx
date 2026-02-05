'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface ChartRadarProps {
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

export default function ChartRadar({ data }: ChartRadarProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Performance', 'SEO', 'UX', 'Conversion', 'Trust'],
        datasets: [
          {
            label: 'Your Store',
            data: [
              data.scores.performance,
              data.scores.seo,
              data.scores.ux,
              data.scores.conversion,
              data.scores.trust
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'Industry Average',
            data: [65, 70, 68, 62, 72],
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderColor: 'rgb(156, 163, 175)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 600
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
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