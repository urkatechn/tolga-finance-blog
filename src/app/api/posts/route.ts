import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category_id')
    const search = searchParams.get('search')
    const publishedStatus = searchParams.get('published_status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name, slug, color),
        author:authors(id, name, email, avatar_url)
      `)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: posts, error } = await query
    
    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
    
    // Get total count for pagination
    let countQuery = supabase
      .from('posts')
      .select('id', { count: 'exact' })
    
    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }
    
    if (categoryId && categoryId !== 'all') {
      countQuery = countQuery.eq('category_id', categoryId)
    }
    
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }
    
    const { count, error: countError } = await countQuery
    
    if (countError) {
      console.error('Error counting posts:', countError)
    }
    
    return NextResponse.json({
      posts,
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featured_image_url, 
      category_id, 
      status, 
      featured, 
      meta_title, 
      meta_description,
      published_at 
    } = body
    
    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }
    
    // Set published_at if status is published and not already set
    let publishedAt = published_at
    if (status === 'published' && !published_at) {
      publishedAt = new Date().toISOString()
    }
    
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featured_image_url: featured_image_url || null,
        author_id: user.id,
        category_id: category_id || null,
        status: status || 'draft',
        featured: featured || false,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        published_at: publishedAt
      }])
      .select(`
        *,
        category:categories(id, name, slug, color),
        author:authors(id, name, email, avatar_url)
      `)
      .single()
    
    if (error) {
      console.error('Error creating post:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Post slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
