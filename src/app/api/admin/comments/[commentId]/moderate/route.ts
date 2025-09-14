import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();

    // Authenticate the admin user
    await requireAuth();

    // Validate input – allow partial updates but require at least one flag
    const { is_approved, is_spam } = body as { is_approved?: boolean; is_spam?: boolean };
    if (typeof is_approved !== 'boolean' && typeof is_spam !== 'boolean') {
      return NextResponse.json(
        { error: 'Provide is_approved and/or is_spam boolean values' },
        { status: 400 }
      );
    }

    // Update the comment using the service role client (bypasses RLS for admin actions)
    const supabase = await createServiceClient();

    // Try to resolve a valid author ID for moderation attribution.
    // We use the default author (authors.is_default = true). If none exists, we omit moderated_by.
    let moderatorAuthorId: string | null = null;
    try {
      const { data: defaultAuthor } = await supabase
        .from('authors')
        .select('id')
        .eq('is_default', true)
        .limit(1);
      if (defaultAuthor && Array.isArray(defaultAuthor) && defaultAuthor.length > 0) {
        moderatorAuthorId = (defaultAuthor[0] as { id: string }).id;
      }
    } catch (e) {
      // Non-fatal; we can proceed without moderated_by
      console.warn('Could not resolve default author for moderation:', e);
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      moderated_at: new Date().toISOString(),
    };
    if (typeof is_approved === 'boolean') updatePayload.is_approved = is_approved;
    if (typeof is_spam === 'boolean') updatePayload.is_spam = is_spam;
    if (moderatorAuthorId) updatePayload.moderated_by = moderatorAuthorId;

    const { data, error } = await supabase
      .from('comments')
      .update(updatePayload)
      .eq('id', commentId)
      .select('id,is_approved,is_spam,moderated_by,moderated_at,updated_at')
      .single();

    if (error) {
      console.error('Moderation update error:', error);
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comment updated', comment: data });
  } catch (error) {
    console.error('Error moderating comment:', error);

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
