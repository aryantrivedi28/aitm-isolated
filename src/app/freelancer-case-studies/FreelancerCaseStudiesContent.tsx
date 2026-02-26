'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CaseStudy } from '../../types/freelancer2'
import { motion } from 'framer-motion'
import { Filter, X, Search, ChevronRight } from 'lucide-react'

export default function FreelancerCaseStudiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const categories = [
    'Google Ads',
    'Facebook Ads',
    'SEO',
    'Email Marketing',
    'Content Marketing',
    'Web Development',
    'E-commerce',
    'Conversion Optimization'
  ]

  const industries = [
    'E-commerce',
    'Real Estate',
    'SaaS',
    'Healthcare',
    'Education',
    'Finance',
    'Travel',
    'Professional Services'
  ]

  useEffect(() => {
    fetchCaseStudies()
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCaseStudies = async () => {
    setLoading(true)
    const params = new URLSearchParams(searchParams)
    
    try {
      const response = await fetch(`/api/freelancer/case-studies?${params}`)
      const data = await response.json()
      setCaseStudies(data.data || [])
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 1 })
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/freelancer-case-studies?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/freelancer-case-studies')
    setSelectedCategory('')
    setSelectedIndustry('')
    setSearchQuery('')
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilters('search', searchQuery)}
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateFilters('category', category === selectedCategory ? '' : category)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Industries</h3>
        <div className="space-y-2">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => updateFilters('industry', industry === selectedIndustry ? '' : industry)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedIndustry === industry
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedIndustry || searchQuery) && (
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Matching your company case studies style */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Freelancer Case Studies</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Real results from our talented freelancers. See how they've helped businesses like yours succeed.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm mb-6"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Modal */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setShowMobileFilter(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {caseStudies.length} of {pagination.total} case studies
              </p>
            </div>

            {/* Case Studies Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudies.map((study, index) => (
                    <motion.div
                      key={study.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/freelancer-case-studies/${study.slug}`}>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                          {/* Image */}
                          <div className="relative h-56 w-full overflow-hidden">
                            <Image
                              src={study.image_url}
                              alt={study.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {study.is_featured && (
                              <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                                Featured
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            {/* Categories */}
                            <div className="flex gap-2 mb-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {study.category}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                                {study.industry}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {study.title}
                            </h3>

                            {/* Short Summary */}
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {study.short_summary}
                            </p>

                            {/* Freelancer Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {study.freelancer?.avatar_url ? (
                                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                    <Image
                                      src={study.freelancer.avatar_url}
                                      alt={study.freelancer.full_name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                      {study.freelancer?.full_name?.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-sm">{study.freelancer?.full_name}</p>
                                  <p className="text-xs text-gray-500">{study.freelancer?.title}</p>
                                </div>
                              </div>

                              {/* Key Metric */}
                              {study.metrics?.[0] && (
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">{study.metrics[0].label}</div>
                                  <div className="text-lg font-bold text-blue-600">
                                    {study.metrics[0].type === 'percentage' 
                                      ? `${study.metrics[0].value}%`
                                      : study.metrics[0].type === 'currency'
                                      ? `$${study.metrics[0].value.toLocaleString()}`
                                      : study.metrics[0].value}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams)
                          params.set('page', page.toString())
                          router.push(`/freelancer-case-studies?${params.toString()}`)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}