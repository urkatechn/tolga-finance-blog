import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { postIds } = body
    
    // Validate that postIds is an array with at least one ID
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs array is required and must not be empty' }, { status: 400 })
    }
    
    // Delete posts with the given IDs
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .in('id', postIds)
      .select('id')
    
    if (error) {
      console.error('Error deleting posts:', error)
      return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 })
    }
    
    const deletedCount = data?.length || 0
    
    // Invalidate caches and revalidate relevant paths
    try {
      revalidateTag('posts')
      revalidateTag('recent-posts')
      revalidateTag('featured-posts')
      revalidatePath('/')
      revalidatePath('/blog')
    } catch (e) {
      console.error('Cache revalidation error (DELETE /posts/bulk-delete):', e)
    }

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Successfully deleted ${deletedCount} post${deletedCount !== 1 ? 's' : ''}`
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
