'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function EditCaseStudyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    short_summary: '',
    category: '',
    industry: '',
    service_type: '',
    problem_statement: '',
    solution_provided: '',
    strategy: '',
    implementation: '',
    results_overview: '',
    metrics: [] as Array<{ label: string; value: number; type: string }>,
    technologies: [] as string[],
    tags: [] as string[],
    image_url: '',
    gallery_images: [] as string[],
    project_url: '',
    testimonial: {
      content: '',
      author: '',
      role: ''
    },
    status: 'draft',
    is_featured: false
  })

  const [newTech, setNewTech] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newMetric, setNewMetric] = useState({ label: '', value: 0, type: 'number' })
  const [uploading, setUploading] = useState(false)

  const isNew = params.id === 'new'

  useEffect(() => {
    if (!isNew) {
      fetchCaseStudy()
    } else {
      setLoading(false)
    }
  }, [params.id])

  const fetchCaseStudy = async () => {
    try {
      const { data } = await supabase
        .from('freelancer_case_studies')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching case study:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `case-studies/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('freelancer-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('freelancer-assets')
        .getPublicUrl(filePath)

      if (isGallery) {
        setFormData({
          ...formData,
          gallery_images: [...formData.gallery_images, publicUrl]
        })
      } else {
        setFormData({ ...formData, image_url: publicUrl })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase
          .from('freelancer_case_studies')
          .insert([formData])

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('freelancer_case_studies')
          .update(formData)
          .eq('id', params.id)

        if (error) throw error
      }

      router.push('/admin-panel/freelancer-case-studies')
    } catch (error) {
      console.error('Error saving case study:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin-panel/freelancer-case-studies"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">
              {isNew ? 'Create New Case Study' : 'Edit Case Study'}
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin-panel/freelancer-case-studies"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.short_summary}
                  onChange={(e) => setFormData({ ...formData, short_summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="SEO">SEO</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select industry</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  value={formData.service_type || ''}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., PPC Management, SEO Audit"
                />
              </div>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Problem & Solution</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.problem_statement}
                  onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solution Provided *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.solution_provided}
                  onChange={(e) => setFormData({ ...formData, solution_provided: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strategy
                </label>
                <textarea
                  rows={4}
                  value={formData.strategy || ''}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Implementation
                </label>
                <textarea
                  rows={4}
                  value={formData.implementation || ''}
                  onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results & Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Results & Metrics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Results Overview *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.results_overview}
                  onChange={(e) => setFormData({ ...formData, results_overview: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Metrics *
                </label>
                
                {/* Existing Metrics */}
                <div className="space-y-2 mb-4">
                  {formData.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{metric.label}</div>
                        <div className="text-sm text-gray-600">
                          {metric.value} {metric.type === 'percentage' ? '%' : metric.type === 'currency' ? 'USD' : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newMetrics = [...formData.metrics]
                          newMetrics.splice(index, 1)
                          setFormData({ ...formData, metrics: newMetrics })
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Metric */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g., ROAS)"
                    value={newMetric.label}
                    onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({ ...newMetric, value: parseFloat(e.target.value) })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newMetric.type}
                    onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value as any })}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="number">Number</option>
                    <option value="percentage">Percentage</option>
                    <option value="currency">Currency</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (newMetric.label && newMetric.value) {
                        setFormData({
                          ...formData,
                          metrics: [...formData.metrics, { ...newMetric }]
                        })
                        setNewMetric({ label: '', value: 0, type: 'number' })
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image *
                </label>
                {formData.image_url && (
                  <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image_url}
                      alt="Main"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  disabled={uploading}
                  className="w-full"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {formData.gallery_images.map((image, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                      <Image
                        src={image}
                        alt={`Gallery ${index}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = [...formData.gallery_images]
                          newGallery.splice(index, 1)
                          setFormData({ ...formData, gallery_images: newGallery })
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  disabled={uploading}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Technologies & Tags */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Technologies & Tags</h2>
            <div className="space-y-4">
              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            technologies: formData.technologies.filter(t => t !== tech)
                          })
                        }}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTech && !formData.technologies.includes(newTech)) {
                        setFormData({
                          ...formData,
                          technologies: [...formData.technologies, newTech]
                        })
                        setNewTech('')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tags: formData.tags.filter(t => t !== tag)
                          })
                        }}
                        className="text-blue-600 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTag && !formData.tags.includes(newTag)) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, newTag]
                        })
                        setNewTag('')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Client Testimonial</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Content
                </label>
                <textarea
                  rows={3}
                  value={formData.testimonial?.content || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, content: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.testimonial?.author || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, author: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.testimonial?.role || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, role: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project URL */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Project URL</h2>
            <input
              type="url"
              value={formData.project_url || ''}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status & Featured */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Status & Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Case Study</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}