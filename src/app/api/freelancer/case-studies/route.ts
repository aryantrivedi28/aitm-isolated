import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })
  
  let query = supabase
    .from('freelancer_case_studies')
    .select(`
      *,
      freelancer:freelancers (
        id,
        full_name,
        avatar_url,
        title,
        hourly_rate,
        skills
      )
    `)

  // Apply filters
  const status = searchParams.get('status')
  if (status) {
    query = query.eq('status', status)
  } else {
    query = query.eq('status', 'approved') // Default to approved for public
  }

  // Category filter
  if (searchParams.get('category')) {
    query = query.eq('category', searchParams.get('category'))
  }

  // Industry filter
  if (searchParams.get('industry')) {
    query = query.eq('industry', searchParams.get('industry'))
  }

  // Freelancer filter
  if (searchParams.get('freelancer')) {
    query = query.eq('freelancer_id', searchParams.get('freelancer'))
  }

  // Tag filter (using array contains)
  if (searchParams.get('tag')) {
    query = query.contains('tags', [searchParams.get('tag')])
  }

  // Featured filter
  if (searchParams.get('featured') === 'true') {
    query = query.eq('is_featured', true)
  }

  // Search by title or summary
  if (searchParams.get('search')) {
    const search = searchParams.get('search')
    query = query.or(`title.ilike.%${search}%,short_summary.ilike.%${search}%`)
  }

  // Sorting
  const sortBy = searchParams.get('sort') || 'created_at'
  const sortOrder = searchParams.get('order') || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const start = (page - 1) * limit
  const end = start + limit - 1

  // Get total count for pagination
  const { count } = await supabase
    .from('freelancer_case_studies')
    .select('*', { count: 'exact', head: true })
    .eq('status', status || 'approved')

  query = query.range(start, end)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is a freelancer
  const { data: freelancer, error: freelancerError } = await supabase
    .from('freelancers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (freelancerError || !freelancer) {
    return NextResponse.json({ error: 'Freelancer profile not found' }, { status: 403 })
  }

  const body = await request.json()

  // Validate required fields
  const requiredFields = [
    'title', 'category', 'industry', 'short_summary',
    'problem_statement', 'solution_provided', 'results_overview',
    'image_url', 'metrics'
  ]

  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json({ 
        error: `Missing required field: ${field}` 
      }, { status: 400 })
    }
  }

  // Validate metrics
  if (!Array.isArray(body.metrics) || body.metrics.length === 0) {
    return NextResponse.json({ 
      error: 'At least one metric is required' 
    }, { status: 400 })
  }

  // Generate unique slug
  let slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Check if slug exists and make it unique
  const { data: existing } = await supabase
    .from('freelancer_case_studies')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    slug = `${slug}-${Date.now()}`
  }

  const { data, error } = await supabase
    .from('freelancer_case_studies')
    .insert({
      ...body,
      freelancer_id: freelancer.id,
      slug,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Case study ID required' }, { status: 400 })
  }

  // Check if user is admin or the freelancer owner
  const { data: caseStudy } = await supabase
    .from('freelancer_case_studies')
    .select('freelancer_id')
    .eq('id', id)
    .single()

  if (!caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 })
  }

  const { data: freelancer } = await supabase
    .from('freelancers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: adminCheck } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const isOwner = freelancer?.id === caseStudy.freelancer_id
  const isAdmin = !!adminCheck

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase
    .from('freelancer_case_studies')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}