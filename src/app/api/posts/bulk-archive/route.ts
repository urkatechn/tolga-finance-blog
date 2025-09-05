import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { postIds, status } = body
    
    // Validate that postIds is an array with at least one ID
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs array is required and must not be empty' }, { status: 400 })
    }
    
    // Validate status
    if (!status || !['archived', 'draft'].includes(status)) {
      return NextResponse.json({ error: 'Status must be either "archived" or "draft"' }, { status: 400 })
    }
    
    // Update posts with the given IDs
    const { data, error } = await supabase
      .from('posts')
      .update({ status })
      .in('id', postIds)
      .select('id, title, status')
    
    if (error) {
      console.error('Error updating posts:', error)
      return NextResponse.json({ error: 'Failed to update posts' }, { status: 500 })
    }
    
    const updatedCount = data?.length || 0
    const actionWord = status === 'archived' ? 'archived' : 'unarchived'
    
    return NextResponse.json({ 
      success: true, 
      updatedCount,
      message: `Successfully ${actionWord} ${updatedCount} post${updatedCount !== 1 ? 's' : ''}`
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
