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
    
    // Run database verification
    const result = await setupDatabase()
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Database verification completed successfully!' },
        { status: 200 }
      )
    } else {
      const statusCode = result.needsMigration ? 400 : 500
      return NextResponse.json(
        { 
          error: result.error || 'Database verification failed', 
          details: { needsMigration: result.needsMigration } 
        },
        { status: statusCode }
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
    message: 'Database Verification API',
    usage: 'Send a POST request to this endpoint to verify database setup',
    note: 'You must be authenticated to run this verification'
  })
}
