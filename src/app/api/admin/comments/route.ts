import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const supabase = await createServiceClient();
    
    let query = supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        author_name,
        author_email,
        content,
        is_approved,
        is_spam,
        moderated_by,
        moderated_at,
        created_at,
        updated_at,
        posts (
          title,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filter
    switch (filter) {
      case 'pending':
        query = query.eq('is_approved', false).eq('is_spam', false);
        break;
      case 'approved':
        query = query.eq('is_approved', true);
        break;
      case 'spam':
        query = query.eq('is_spam', true);
        break;
      // 'all' - no additional filters
    }

    const { data: comments, error } = await query;

    if (error) {
      console.error('Error fetching admin comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
