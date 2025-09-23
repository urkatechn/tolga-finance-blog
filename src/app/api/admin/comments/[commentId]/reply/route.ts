import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    await requireAuth();
    const { commentId } = await params;
    const body = await request.json();
    const { content } = body as { content?: string };

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Reply content is required' }, { status: 400 });
    }

    const text = content.trim();
    if (text.length > 4000) {
      return NextResponse.json({ error: 'Reply too long (max 4000 characters)' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch parent comment to get post_id
    const { data: parent, error: findError } = await supabase
      .from('comments')
      .select('id, post_id')
      .eq('id', commentId)
      .single();

    if (findError || !parent) {
      return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
    }

    // Create admin reply (approved by default)
    const { data: inserted, error: insertError } = await supabase
      .from('comments')
      .insert({
        post_id: parent.post_id,
        parent_id: commentId,
        author_name: 'Tolga Tanagardigil',
        author_email: null,
        content: text,
        is_approved: true,
        is_spam: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, post_id, parent_id, author_name, content, is_approved, is_spam, created_at, updated_at')
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reply added', comment: inserted });
  } catch (error) {
    console.error('Error replying to comment:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}
