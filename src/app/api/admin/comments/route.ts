import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/server';
import { createHash } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Require authentication for admin listing
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSizeRaw = parseInt(searchParams.get('pageSize') || '20', 10);
    const pageSize = Math.max(1, Math.min(100, isNaN(pageSizeRaw) ? 20 : pageSizeRaw));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
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

    // Apply pagination to the data query
    const { data: comments, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching admin comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }
    
    // Attach gravatar hash (do not modify stored data); keep author_email visible for admins
    const withHash = (comments || []).map((c: any) => ({
      ...c,
      gravatar_hash: c.author_email ? createHash('md5').update(String(c.author_email).trim().toLowerCase()).digest('hex') : undefined,
    }));

    // Count total items for the current filter (without pagination)
    let countQuery = supabase.from('comments').select('id', { count: 'exact' });
    switch (filter) {
      case 'pending':
        countQuery = countQuery.eq('is_approved', false).eq('is_spam', false);
        break;
      case 'approved':
        countQuery = countQuery.eq('is_approved', true);
        break;
      case 'spam':
        countQuery = countQuery.eq('is_spam', true);
        break;
      default:
        // all
        break;
    }
    const { count } = await countQuery;

    return NextResponse.json({ comments: withHash, total: count || 0, page, pageSize });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
