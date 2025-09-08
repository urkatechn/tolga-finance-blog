import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

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
        likes_count,
        is_approved
      `)
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    // Organize comments with replies
    const commentsMap = new Map();
    const rootComments: Array<{
      id: string;
      author_name: string;
      author_email: string | null;
      content: string;
      created_at: string;
      parent_id: string | null;
      likes_count: number;
      is_approved: boolean;
      replies: Array<any>;
    }> = [];

    // First pass: create all comments
    comments?.forEach(comment => {
      commentsMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    comments?.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentsMap.get(comment.id));
        }
      } else {
        rootComments.push(commentsMap.get(comment.id));
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
    
    const { author_name, author_email, content, parent_id } = body;

    // Validate required fields
    if (!author_name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Name and content are required' }, 
        { status: 400 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || '127.0.0.1';

    // Insert comment with required fields
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_name: author_name.trim(),
        author_email: author_email?.trim() || null,
        author_ip: clientIp,
        content: content.trim(),
        parent_id: parent_id || null,
        is_approved: false, // Comments need approval by default
        likes_count: 0,
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
