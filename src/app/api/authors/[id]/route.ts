import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    
    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching author:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch author' }, { status: 500 })
    }
    
    return NextResponse.json(author)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = params
    const body = await request.json()
    
    const { 
      name, 
      email, 
      bio, 
      avatar_url, 
      website_url, 
      social_links, 
      is_default 
    } = body
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    // If setting as default, unset other defaults first
    if (is_default) {
      await supabase
        .from('authors')
        .update({ is_default: false })
        .eq('is_default', true)
        .neq('id', id)
    }
    
    const { data: author, error } = await supabase
      .from('authors')
      .update({
        name,
        email: email || null,
        bio: bio || null,
        avatar_url: avatar_url || null,
        website_url: website_url || null,
        social_links: social_links || {},
        is_default: is_default || false
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating author:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update author' }, { status: 500 })
    }
    
    return NextResponse.json(author)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = params
    
    // Check if this author is being used in posts
    const { data: postsCount, error: countError } = await supabase
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('author_id', id)
    
    if (countError) {
      console.error('Error checking author usage:', countError)
      return NextResponse.json({ error: 'Failed to check author usage' }, { status: 500 })
    }
    
    if (postsCount && postsCount.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete author that is assigned to posts. Please reassign the posts first.' 
      }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting author:', error)
      return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Author deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
