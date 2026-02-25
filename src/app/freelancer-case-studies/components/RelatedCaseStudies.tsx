'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CaseStudy } from '../../../types/freelancer2'

interface Props {
  currentId: string
  category: string
  freelancerId: string
}

export default function RelatedCaseStudies({ currentId, category, freelancerId }: Props) {
  const [related, setRelated] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelated()
  }, [currentId, category, freelancerId])

  const fetchRelated = async () => {
    try {
      // Fetch from same category and same freelancer
      const response = await fetch(
        `/api/freelancer/case-studies?category=${encodeURIComponent(category)}&freelancer=${freelancerId}&limit=3`
      )
      const data = await response.json()
      
      // Filter out current case study
      const filtered = data.data?.filter((study: CaseStudy) => study.id !== currentId) || []
      setRelated(filtered.slice(0, 3))
    } catch (error) {
      console.error('Error fetching related case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (related.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No related case studies found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((study) => (
        <Link
          key={study.id}
          href={`/freelancer-case-studies/${study.slug}`}
          className="group"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48 w-full">
              <Image
                src={study.image_url}
                alt={study.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {study.category}
                </span>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {study.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {study.short_summary}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}