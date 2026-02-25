import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/SupabaseAuthClient'

export async function GET() {
  
  try {
    // Get overall stats for approved case studies
    const { data, error } = await supabase
      .from('freelancer_case_studies')
      .select('category, industry, view_count, created_at')
      .eq('status', 'approved')

    if (error) throw error

    // Calculate stats
    const totalCaseStudies = data.length
    const totalViews = data.reduce((sum, study) => sum + (study.view_count || 0), 0)
    const avgViewsPerStudy = totalViews / totalCaseStudies || 0

    // Category distribution
    const categoryDistribution = data.reduce((acc: Record<string, number>, study) => {
      acc[study.category] = (acc[study.category] || 0) + 1
      return acc
    }, {})

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrends = data
      .filter(study => new Date(study.created_at) >= sixMonthsAgo)
      .reduce((acc: Record<string, number>, study) => {
        const month = new Date(study.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

    // Top categories by views
    const topCategories = Object.entries(
      data.reduce((acc: Record<string, { count: number; views: number }>, study) => {
        if (!acc[study.category]) {
          acc[study.category] = { count: 0, views: 0 }
        }
        acc[study.category].count += 1
        acc[study.category].views += study.view_count || 0
        return acc
      }, {})
    )
      .map(([category, stats]) => ({
        category,
        ...stats,
        avgViews: stats.views / stats.count
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    return NextResponse.json({
      totalCaseStudies,
      totalViews,
      avgViewsPerStudy: Math.round(avgViewsPerStudy * 10) / 10,
      categoryDistribution,
      monthlyTrends,
      topCategories
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}