import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { createHash } from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const supabase = await createClient();

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        author_name,
        author_email,
        content,
        created_at,
        parent_id,
        is_approved
      `)
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    // Create a privacy-safe structure with optional gravatar hash (no email in response)
    type PublicComment = {
      id: string;
      author_name: string;
      gravatar_hash?: string;
      content: string;
      created_at: string;
      parent_id: string | null;
      is_approved: boolean;
      replies: PublicComment[];
    };

    const makeHash = (email: string | null) => {
      if (!email) return undefined;
      const normalized = email.trim().toLowerCase();
      if (!normalized) return undefined;
      return createHash('md5').update(normalized).digest('hex');
    };

    const commentsMap = new Map<string, PublicComment>();
    const rootComments: PublicComment[] = [];

    comments?.forEach((c: any) => {
      const publicC: PublicComment = {
        id: c.id,
        author_name: c.author_name,
        gravatar_hash: makeHash(c.author_email ?? null),
        content: c.content,
        created_at: c.created_at,
        parent_id: c.parent_id,
        is_approved: c.is_approved,
        replies: [],
      };
      commentsMap.set(c.id, publicC);
    });

    comments?.forEach((c: any) => {
      const item = commentsMap.get(c.id)!;
      if (c.parent_id) {
        const parent = commentsMap.get(c.parent_id);
        if (parent) parent.replies.push(item);
      } else {
        rootComments.push(item);
      }
    });

    return NextResponse.json({ comments: rootComments });
  } catch (error) {
    console.error('Error in GET /api/posts/[postId]/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const supabase = await createServiceClient(); // Use service client to bypass RLS
    const body = await request.json();

    const { author_name, author_email, content, parent_id, honeypot } = body as {
      author_name?: string;
      author_email?: string;
      content?: string;
      parent_id?: string;
      honeypot?: string;
    };

    // Simple honeypot check (bots will fill hidden field)
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Validate required fields and lengths
    if (!author_name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const name = author_name.trim();
    const text = content.trim();
    if (name.length > 120) {
      return NextResponse.json({ error: 'Name too long' }, { status: 400 });
    }
    if (text.length > 4000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    let email: string | null = null;
    if (author_email && author_email.trim()) {
      const e = author_email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(e)) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
      }
      if (e.length > 200) {
        return NextResponse.json({ error: 'Email too long' }, { status: 400 });
      }
      email = e;
    }

    // Insert comment with required fields
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_name: name,
        author_email: email,
        content: text,
        parent_id: parent_id || null,
        is_approved: false, // Comments need approval by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Comment submitted successfully! It will appear after approval.',
      comment
    });
  } catch (error) {
    console.error('Error in POST /api/posts/[postId]/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
