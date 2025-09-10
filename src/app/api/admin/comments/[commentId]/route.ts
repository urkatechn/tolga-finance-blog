import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    // Authenticate admin
    await requireAuth();

    const supabase = await createServiceClient();

    // Delete the comment and any direct replies
    const { error } = await supabase
      .from('comments')
      .delete()
      .or(`id.eq.${commentId},parent_id.eq.${commentId}`);

    if (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);

    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
