import { NextRequest, NextResponse } from 'next/server';
import { moderateComment } from '@/lib/api/likes-comments';
import { CommentModerationData } from '@/lib/database/likes-comments-types';
import { requireAuth } from '@/lib/auth/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    
    console.log('Moderating comment:', commentId, 'with data:', body);
    
    // Get authenticated user
    const user = await requireAuth();
    
    // Check if required environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Missing Supabase URL configuration' },
        { status: 500 }
      );
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Missing Supabase service role key configuration' },
        { status: 500 }
      );
    }
    
    // Check if user exists in authors table, otherwise set to null
    const { createServiceClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceClient();
    
    const { data: author } = await supabase
      .from('authors')
      .select('id')
      .eq('id', user.id)
      .single();
    
    const moderationData: CommentModerationData = {
      is_approved: body.is_approved,
      is_spam: body.is_spam || false,
      moderated_by: author?.id || null // Use author ID if exists, otherwise null
    };

    console.log('Moderation data:', moderationData);
    
    const comment = await moderateComment(commentId, moderationData);
    
    console.log('Moderation successful:', comment);
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error moderating comment:', error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to moderate comment' },
      { status: 500 }
    );
  }
}
