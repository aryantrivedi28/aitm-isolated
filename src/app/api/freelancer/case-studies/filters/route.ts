import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/SupabaseAuthClient'

export async function GET() {
  
  try {
    // Get all approved case studies for filter options
    const { data } = await supabase
      .from('freelancer_case_studies')
      .select('category, industry, technologies')
      .eq('status', 'approved')

    if (!data) {
      return NextResponse.json({ 
        categories: [], 
        industries: [], 
        technologies: [] 
      })
    }

    // Count frequencies
    const categoryCount: Record<string, number> = {}
    const industryCount: Record<string, number> = {}
    const techCount: Record<string, number> = {}

    data.forEach(study => {
      // Categories
      if (study.category) {
        categoryCount[study.category] = (categoryCount[study.category] || 0) + 1
      }

      // Industries
      if (study.industry) {
        industryCount[study.industry] = (industryCount[study.industry] || 0) + 1
      }

      // Technologies
      if (study.technologies) {
        study.technologies.forEach((tech: string) => {
          techCount[tech] = (techCount[tech] || 0) + 1
        })
      }
    })

    // Transform to array format
    const categories = Object.entries(categoryCount)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count)

    const industries = Object.entries(industryCount)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count)

    const technologies = Object.entries(techCount)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // Limit to top 20 technologies

    return NextResponse.json({
      categories,
      industries,
      technologies
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}