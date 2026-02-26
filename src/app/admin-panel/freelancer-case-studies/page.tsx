'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/SupabaseAuthClient'
import Link from 'next/link'
import { Plus, Filter, Download } from 'lucide-react'
import AdminCaseStudyTable from './components/AdminCaseStudyTable'
import FilterShareLink from './components/FilterShareLink'

export default function AdminFreelancerCaseStudies() {
  const router = useRouter()
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')


  useEffect(() => {
    fetchCaseStudies()
  }, [filter])

  const fetchCaseStudies = async () => {
    setLoading(true)
    let query = supabase
      .from('freelancer_case_studies')
      .select(`
        *,
        freelancer:freelancers (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setCaseStudies(data || [])
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase
      .from('freelancer_case_studies')
      .update({ 
        status,
        is_verified: status === 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (!error) {
      fetchCaseStudies()
    }
  }

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    const { error } = await supabase
      .from('freelancer_case_studies')
      .update({ is_featured: !isFeatured })
      .eq('id', id)

    if (!error) {
      fetchCaseStudies()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('freelancer_case_studies')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchCaseStudies()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Freelancer Case Studies</h1>
          <p className="text-gray-600 mt-1">Manage and review freelancer case studies</p>
        </div>
        
        <div className="flex gap-3">
          <FilterShareLink />
          <Link
            href="/admin-panel/freelancer-case-studies/new/edit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Case Study
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: caseStudies.length, color: 'blue' },
          { label: 'Approved', value: caseStudies.filter((c: any) => c.status === 'approved').length, color: 'green' },
          { label: 'Pending', value: caseStudies.filter((c: any) => c.status === 'pending').length, color: 'yellow' },
          { label: 'Draft', value: caseStudies.filter((c: any) => c.status === 'draft').length, color: 'gray' },
          { label: 'Rejected', value: caseStudies.filter((c: any) => c.status === 'rejected').length, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4">
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'draft', label: 'Drafts' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              filter === tab.value
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {filter === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <AdminCaseStudyTable
        caseStudies={caseStudies}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        onFeatureToggle={handleFeatureToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}