import { NextRequest, NextResponse } from 'next/server';
import { moderateComment } from '@/lib/api/likes-comments';
import { CommentModerationData } from '@/lib/database/likes-comments-types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();
    
    const moderationData: CommentModerationData = {
      is_approved: body.is_approved,
      is_spam: body.is_spam || false,
      moderated_by: 'admin' // In real app, get from session
    };

    const comment = await moderateComment(commentId, moderationData);
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error moderating comment:', error);
    return NextResponse.json(
      { error: 'Failed to moderate comment' },
      { status: 500 }
    );
  }
}
