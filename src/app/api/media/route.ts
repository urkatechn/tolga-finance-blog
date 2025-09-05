import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/user'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // List files from the blog-images bucket
    const { data: files, error } = await supabase.storage
      .from('blog-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (error) {
      console.error('Error fetching files:', error)
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }
    
    // Get public URLs for the files and format the response
    const filesWithUrls = await Promise.all(
      (files || []).map(async (file) => {
        // Try public URL first, fallback to signed URL if needed
        let fileUrl: string;
        
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(file.name)
        
        console.log('Generated public URL:', publicUrl);
        
        // Test if we can use public URLs, otherwise use signed URLs
        try {
          // For now, let's use public URLs and see if they work
          fileUrl = publicUrl;
        } catch (error) {
          // Fallback to signed URL (24 hour expiry)
          const { data: signedUrl } = await supabase.storage
            .from('blog-images')
            .createSignedUrl(file.name, 86400); // 24 hours
          
          fileUrl = signedUrl?.signedUrl || publicUrl;
        }
        
        return {
          id: file.name, // Using filename as ID since Supabase Storage doesn't have separate IDs
          name: file.name,
          url: fileUrl,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'image/unknown',
          created_at: file.created_at || new Date().toISOString(),
        }
      })
    )
    
    return NextResponse.json({ files: filesWithUrls })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
