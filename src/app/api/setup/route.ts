import { setupDatabase } from '@/lib/database/setup'
import { getUser } from '@/lib/supabase/user'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Optional: Check if user is authenticated and has admin privileges
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Run database setup
    const result = await setupDatabase()
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Database setup completed successfully!' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Database setup failed', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Setup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database Setup API',
    usage: 'Send a POST request to this endpoint to run database setup',
    note: 'You must be authenticated to run this setup'
  })
}
