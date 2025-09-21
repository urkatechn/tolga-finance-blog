import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get counts for each status
    const { data: rows, error } = await supabase
      .from('posts')
      .select('status, featured')
    
    if (error) {
      console.error('Error fetching post stats:', error)
      return NextResponse.json({ error: 'Failed to fetch post statistics' }, { status: 500 })
    }
    
    // Calculate statistics
    const total = rows.length
    const published = rows.filter((p: { status: string }) => p.status === 'published').length
    const draft = rows.filter((p: { status: string }) => p.status === 'draft').length
    const archived = rows.filter((p: { status: string }) => p.status === 'archived').length
    const featured = rows.filter((p: { featured: boolean }) => p.featured === true).length
    
    return NextResponse.json({
      total,
      published,
      draft,
      archived,
      featured
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
