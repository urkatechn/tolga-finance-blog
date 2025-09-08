import { NextRequest, NextResponse } from 'next/server';
import { deleteComment } from '@/lib/api/likes-comments';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    
    const success = await deleteComment(commentId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
