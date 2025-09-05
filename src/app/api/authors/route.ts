import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching authors:', error)
      return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 })
    }
    
    return NextResponse.json(authors)
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
    }
    
    const { data: author, error } = await supabase
      .from('authors')
      .insert([{
        name,
        email: email || null,
        bio: bio || null,
        avatar_url: avatar_url || null,
        website_url: website_url || null,
        social_links: social_links || {},
        is_default: is_default || false
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating author:', error)
      return NextResponse.json({ error: 'Failed to create author' }, { status: 500 })
    }
    
    return NextResponse.json(author, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
