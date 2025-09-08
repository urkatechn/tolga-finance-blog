import { NextRequest, NextResponse } from 'next/server';
import { getComments, createComment } from '@/lib/api/likes-comments';
import { CreateCommentData } from '@/lib/database/likes-comments-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const comments = await getComments(postId);
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const body = await request.json();
    
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';
    
    const commentData: CreateCommentData = {
      post_id: postId,
      parent_id: body.parent_id || null,
      author_name: body.author_name,
      author_email: body.author_email || null,
      content: body.content,
      author_ip: ip,
      user_agent: request.headers.get('user-agent') || undefined
    };

    // Basic validation
    if (!commentData.author_name?.trim() || !commentData.content?.trim()) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    // Content length validation
    if (commentData.content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment too long. Maximum 2000 characters.' },
        { status: 400 }
      );
    }

    // Simple spam detection
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'click here'];
    const hasSpam = spamKeywords.some(keyword => 
      commentData.content.toLowerCase().includes(keyword)
    );

    if (hasSpam) {
      return NextResponse.json(
        { error: 'Comment contains prohibited content' },
        { status: 400 }
      );
    }

    const comment = await createComment(commentData);
    
    return NextResponse.json({ 
      comment,
      message: 'Comment submitted successfully. It will appear after approval.' 
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
