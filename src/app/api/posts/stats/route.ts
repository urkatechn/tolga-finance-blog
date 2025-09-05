import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get counts for each status
    const { data: statusCounts, error } = await supabase
      .from('posts')
      .select('status')
    
    if (error) {
      console.error('Error fetching post stats:', error)
      return NextResponse.json({ error: 'Failed to fetch post statistics' }, { status: 500 })
    }
    
    // Calculate statistics
    const total = statusCounts.length
    const published = statusCounts.filter(p => p.status === 'published').length
    const draft = statusCounts.filter(p => p.status === 'draft').length
    const archived = statusCounts.filter(p => p.status === 'archived').length
    
    return NextResponse.json({
      total,
      published,
      draft,
      archived
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
