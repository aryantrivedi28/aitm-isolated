import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/SupabaseAuthClient'

export async function POST(request: Request) {
  
  // Check admin authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminCheck) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action, ids, data } = await request.json()

  if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request: action and ids array required' },
      { status: 400 }
    )
  }

  try {
    let result

    switch (action) {
      case 'approve':
        result = await supabase
          .from('freelancer_case_studies')
          .update({ 
            status: 'approved', 
            is_verified: true,
            updated_at: new Date().toISOString() 
          })
          .in('id', ids)
        break

      case 'reject':
        result = await supabase
          .from('freelancer_case_studies')
          .update({ 
            status: 'rejected',
            updated_at: new Date().toISOString() 
          })
          .in('id', ids)
        break

      case 'delete':
        result = await supabase
          .from('freelancer_case_studies')
          .delete()
          .in('id', ids)
        break

      case 'feature':
        result = await supabase
          .from('freelancer_case_studies')
          .update({ 
            is_featured: data?.featured ?? true,
            updated_at: new Date().toISOString() 
          })
          .in('id', ids)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    if (result.error) throw result.error

    return NextResponse.json({ 
      success: true, 
      message: `Successfully performed ${action} on ${ids.length} case studies` 
    })
  } catch (error) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}