import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('key')
    
    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
    
    // Convert to key-value object for easier consumption
    const settingsMap = settings.reduce((acc: Record<string, unknown>, setting: { key: string; value: unknown }) => {
      // Parse JSON value if it's a string, otherwise use as-is
      let parsedValue = setting.value
      if (typeof setting.value === 'string') {
        try {
          parsedValue = JSON.parse(setting.value)
        } catch {
          // If parsing fails, use the raw value
          parsedValue = setting.value
        }
      }
      acc[setting.key] = parsedValue
      return acc
    }, {} as Record<string, unknown>)
    
    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { settings } = body
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 })
    }
    
    // Update multiple settings
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    }))
    
    const { error } = await supabase
      .from('settings')
      .upsert(updates, { onConflict: 'key' })
    
    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
