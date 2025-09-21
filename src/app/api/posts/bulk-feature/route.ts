import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postIds, featured } = body as { postIds: string[]; featured: boolean }

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs array is required and must not be empty' }, { status: 400 })
    }

    if (typeof featured !== 'boolean') {
      return NextResponse.json({ error: 'featured must be a boolean' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ featured })
      .in('id', postIds)
      .select('id, featured')

    if (error) {
      console.error('Error updating featured flag:', error)
      return NextResponse.json({ error: 'Failed to update posts' }, { status: 500 })
    }

    // Revalidate caches
    try {
      revalidateTag('posts')
      revalidateTag('featured-posts')
      revalidatePath('/')
      revalidatePath('/blog')
    } catch (e) {
      console.error('Cache revalidation error (PUT /posts/bulk-feature):', e)
    }

    const updatedCount = data?.length || 0
    return NextResponse.json({
      success: true,
      updatedCount,
      message: `${featured ? 'Featured' : 'Unfeatured'} ${updatedCount} post${updatedCount !== 1 ? 's' : ''}`,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

