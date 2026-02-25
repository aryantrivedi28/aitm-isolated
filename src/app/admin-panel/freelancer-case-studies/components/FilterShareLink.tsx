'use client'

import { useState } from 'react'
import { Share2, Copy, Check, X } from 'lucide-react'

export default function FilterShareLink() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    industry: '',
    tag: '',
    freelancer: ''
  })

  const generateShareableLink = () => {
    const params = new URLSearchParams()
    
    if (selectedFilters.category) params.set('category', selectedFilters.category)
    if (selectedFilters.industry) params.set('industry', selectedFilters.industry)
    if (selectedFilters.tag) params.set('tag', selectedFilters.tag)
    if (selectedFilters.freelancer) params.set('freelancer', selectedFilters.freelancer)
    
    return `${window.location.origin}/freelancer-case-studies?${params.toString()}`
  }

  const handleCopy = async () => {
    const link = generateShareableLink()
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Generate Share Link
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Generate Shareable Filter Link</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Create a link that shows case studies filtered by specific criteria. Perfect for sending to clients.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedFilters.category}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="SEO">SEO</option>
                    <option value="Email Marketing">Email Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={selectedFilters.industry}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Industries</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={selectedFilters.tag}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g., lead-generation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {Object.values(selectedFilters).some(Boolean) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Preview Link:</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 break-all">
                    {generateShareableLink()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}