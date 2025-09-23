import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string // 'favicon' or 'logo'
    
    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 })
    }
    
    if (!['favicon', 'logo'].includes(type)) {
      return NextResponse.json({ error: 'Type must be favicon or logo' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = type === 'favicon' 
      ? ['image/x-icon', 'image/vnd.microsoft.icon', 'image/ico', 'image/icon', 'text/ico', 'application/ico']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. ${type === 'favicon' ? 'Please upload an ICO file.' : 'Please upload a JPEG, PNG, WebP, or SVG file.'}`
      }, { status: 400 })
    }
    
    // Check file size (max 2MB for logos, 1MB for favicons)
    const maxSize = type === 'favicon' ? 1024 * 1024 : 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${type === 'favicon' ? '1MB' : '2MB'}.` 
      }, { status: 400 })
    }
    
    // Create unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${type}-${timestamp}.${extension}`
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`settings/${filename}`, buffer, {
        contentType: file.type,
        upsert: true
      })
    
    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(`settings/${filename}`)
    
    // Update settings in database
    const settingKey = type === 'favicon' ? 'site_favicon_url' : 'site_logo_url'
    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({
        key: settingKey,
        value: JSON.stringify(publicUrl),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
    
    if (settingsError) {
      console.error('Settings update error:', settingsError)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: `${type === 'favicon' ? 'Favicon' : 'Logo'} uploaded successfully`
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
