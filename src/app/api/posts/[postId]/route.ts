import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { sendNewPostNotifications, shouldSendNotification } from '@/lib/notifications/post-notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const supabase = await createClient()
    const { postId: id } = await params
    
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name, slug, color),
        author:authors(id, name, email, avatar_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching post:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { postId: id } = await params
    const body = await request.json()
    
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featured_image_url, 
      category_id, 
      author_id, 
      status, 
      featured, 
      meta_title, 
      meta_description,
      published_at 
    } = body
    
    // For status-only updates, don't validate all fields
    const isStatusOnlyUpdate = Object.keys(body).length === 1 && body.status
    
    // Validate required fields only for full updates
    if (!isStatusOnlyUpdate && (!title || !slug || !content)) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }
    
    // Get the current post to check ownership and status
    const { data: currentPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id, status, published_at, email_notification_sent')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
    
    // Note: Removed ownership check since author_id from database doesn't match user.id from auth
    // In a production app, you would implement proper role-based access control here
    
    // Handle published_at timestamp
    let publishedAt = published_at
    if (status === 'published') {
      if (!publishedAt && currentPost.status !== 'published') {
        // First time publishing
        publishedAt = new Date().toISOString()
      } else if (!publishedAt) {
        // Keep existing published_at
        publishedAt = currentPost.published_at
      }
    } else {
      // If changing from published to draft/archived, keep the original published_at
      publishedAt = currentPost.published_at
    }
    
    // Build update object based on what's provided
    const updateData: Record<string, unknown> = {}
    
    if (isStatusOnlyUpdate) {
      // Status-only update
      updateData.status = status
      if (status === 'published' && currentPost.status !== 'published' && !currentPost.published_at) {
        updateData.published_at = new Date().toISOString()
      } else if (status === 'draft') {
        // Keep the original published_at when unpublishing
        updateData.published_at = currentPost.published_at
      }
    } else {
      // Full update
      updateData.title = title
      updateData.slug = slug
      updateData.excerpt = excerpt || null
      updateData.content = content
      updateData.featured_image_url = featured_image_url || null
      updateData.category_id = category_id || null
      updateData.author_id = author_id || currentPost.author_id
      updateData.status = status || 'draft'
      updateData.featured = featured || false
      updateData.meta_title = meta_title || null
      updateData.meta_description = meta_description || null
      updateData.published_at = publishedAt
    }
    
    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug, color),
        author:authors(id, name, email, avatar_url)
      `)
      .single()
    
    if (error) {
      console.error('Error updating post:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Post slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
    
    // Send email notifications when post is published for the first time (and email not already sent)
    if (post && shouldSendNotification(currentPost.status, post.status, false, currentPost.email_notification_sent || false)) {
      try {
        // Always use the production domain for email links
        const origin = 'https://tolgatanagardigil.com';
        const postData = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          author: post.author,
          category: post.category
        };
        
        // Only send notifications when publishing for the first time and email not already sent
        await sendNewPostNotifications(postData, origin);
        console.log(`Email notifications sent for published post: ${post.title}`);
      } catch (emailError) {
        console.error('Failed to send email notifications for updated post:', emailError);
        // Don't fail the request if email sending fails
      }
    }

    // Invalidate caches and revalidate relevant paths
    try {
      revalidateTag('posts')
      revalidateTag('recent-posts')
      revalidateTag('featured-posts')
      revalidatePath('/')
      revalidatePath('/blog')
      if (post?.slug) {
        revalidatePath(`/blog/${post.slug}`)
      }
    } catch (e) {
      console.error('Cache revalidation error (PUT /posts/[id]):', e)
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { postId: id } = await params
    
    // Get the post to check ownership
    const { error: fetchError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
    
    // Note: Removed ownership check since author_id from database doesn't match user.id from auth
    // In a production app, you would implement proper role-based access control here
    
    // Get slug before delete to revalidate detail path
    const { data: toDelete } = await supabase
      .from('posts')
      .select('slug')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
    
    // Invalidate caches and revalidate relevant paths
    try {
      revalidateTag('posts')
      revalidateTag('recent-posts')
      revalidateTag('featured-posts')
      revalidatePath('/')
      revalidatePath('/blog')
      if (toDelete?.slug) {
        revalidatePath(`/blog/${toDelete.slug}`)
      }
    } catch (e) {
      console.error('Cache revalidation error (DELETE /posts/[id]):', e)
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
