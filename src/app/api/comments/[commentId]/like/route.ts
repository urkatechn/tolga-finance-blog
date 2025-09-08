import { NextRequest, NextResponse } from 'next/server';
import { likeComment, unlikeComment } from '@/lib/api/likes-comments';

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    const { action } = await request.json();

    if (action === 'like') {
      const result = await likeComment(commentId);
      return NextResponse.json(result);
    } else if (action === 'unlike') {
      const result = await unlikeComment(commentId);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "like" or "unlike"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in comment like API:', error);
    
    if (error.message === 'Already liked') {
      return NextResponse.json(
        { error: 'Comment already liked' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process like action' },
      { status: 500 }
    );
  }
}
