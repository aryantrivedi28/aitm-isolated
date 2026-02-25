// app/api/freelancer/case-studies/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/SupabaseAuthClient"
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  
  const { data, error } = await supabase
    .from('freelancer_case_studies')
    .select(`
      *,
      freelancer:freelancers (
        id,
        full_name,
        avatar_url,
        title,
        hourly_rate,
        skills,
        experience_years,
        completed_projects,
        linkedin_url,
        github_url,
        portfolio_url,
        bio
      )
    `)
    .eq('slug', params.slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 })
  }

  // Only increment view count if it's approved and being viewed publicly
  const isPublic = !request.headers.get('referer')?.includes('/admin')
  if (isPublic && data.status === 'approved') {
    await supabase
      .from('freelancer_case_studies')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id)
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Get the case study
  const { data: caseStudy, error: fetchError } = await supabase
    .from('freelancer_case_studies')
    .select('id, freelancer_id, slug')
    .eq('slug', params.slug)
    .single()

  if (fetchError || !caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 })
  }

  // Check permissions
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

  // Only admin can change status to approved/rejected
  if (!isAdmin && (body.status === 'approved' || body.status === 'rejected')) {
    delete body.status
  }

  // If title is being updated, regenerate slug
  if (body.title) {
    let newSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if new slug exists and is different from current
    if (newSlug !== caseStudy.slug) {
      const { data: existing } = await supabase
        .from('freelancer_case_studies')
        .select('slug')
        .eq('slug', newSlug)
        .neq('id', caseStudy.id)
        .maybeSingle()

      if (existing) {
        newSlug = `${newSlug}-${Date.now()}`
      }
      body.slug = newSlug
    }
  }

  const { data, error } = await supabase
    .from('freelancer_case_studies')
    .update({ 
      ...body, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', caseStudy.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the case study
  const { data: caseStudy, error: fetchError } = await supabase
    .from('freelancer_case_studies')
    .select('freelancer_id')
    .eq('slug', params.slug)
    .single()

  if (fetchError || !caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 })
  }

  // Check permissions
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
    .eq('slug', params.slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}