'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Search, ChevronDown } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

export default function CaseStudyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [industries, setIndustries] = useState<FilterOption[]>([])
  const [technologies, setTechnologies] = useState<FilterOption[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    industries: true,
    technologies: false
  })

  const selectedCategory = searchParams.get('category') || ''
  const selectedIndustry = searchParams.get('industry') || ''
  const selectedTech = searchParams.get('tech') || ''
  const sortBy = searchParams.get('sort') || 'newest'

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/freelancer/case-studies/filters')
      const data = await response.json()
      setCategories(data.categories || [])
      setIndustries(data.industries || [])
      setTechnologies(data.technologies || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value && value !== selectedCategory) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1')
    
    router.push(`/freelancer-case-studies?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/freelancer-case-studies')
    setSearchQuery('')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      updateFilter('search', searchQuery)
    }
  }

  const activeFiltersCount = [
    selectedCategory,
    selectedIndustry,
    selectedTech,
    searchParams.get('search')
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search case studies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              const params = new URLSearchParams(searchParams)
              params.delete('search')
              router.push(`/freelancer-case-studies?${params.toString()}`)
            }}
            className="absolute right-3 top-3.5"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Active Filters ({activeFiltersCount})
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {selectedCategory}
                <button onClick={() => updateFilter('category', '')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedIndustry && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {selectedIndustry}
                <button onClick={() => updateFilter('industry', '')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTech && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {selectedTech}
                <button onClick={() => updateFilter('tech', '')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort By */}
      <div className="bg-white rounded-lg p-4 border">
        <h3 className="font-medium mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most_viewed">Most Viewed</option>
          <option value="featured">Featured First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg p-4 border">
        <button
          onClick={() => setExpandedSections(prev => ({ ...prev, categories: !prev.categories }))}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-medium">Categories</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.categories && (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category.value}
                    onChange={() => updateFilter('category', category.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                {category.count && (
                  <span className="text-xs text-gray-500">({category.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Industries */}
      <div className="bg-white rounded-lg p-4 border">
        <button
          onClick={() => setExpandedSections(prev => ({ ...prev, industries: !prev.industries }))}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-medium">Industries</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.industries ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.industries && (
          <div className="mt-3 space-y-2">
            {industries.map((industry) => (
              <label key={industry.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedIndustry === industry.value}
                    onChange={() => updateFilter('industry', industry.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{industry.label}</span>
                </div>
                {industry.count && (
                  <span className="text-xs text-gray-500">({industry.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Technologies */}
      <div className="bg-white rounded-lg p-4 border">
        <button
          onClick={() => setExpandedSections(prev => ({ ...prev, technologies: !prev.technologies }))}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-medium">Technologies</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.technologies ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.technologies && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {technologies.map((tech) => (
              <label key={tech.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTech === tech.value}
                    onChange={() => updateFilter('tech', tech.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{tech.label}</span>
                </div>
                {tech.count && (
                  <span className="text-xs text-gray-500">({tech.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}