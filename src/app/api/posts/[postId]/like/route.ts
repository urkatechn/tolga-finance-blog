import { NextRequest, NextResponse } from 'next/server';
import { likePost, unlikePost, checkPostLiked } from '@/lib/api/likes-comments';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const { action } = await request.json();

    if (action === 'like') {
      const result = await likePost(postId);
      return NextResponse.json(result);
    } else if (action === 'unlike') {
      const result = await unlikePost(postId);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "like" or "unlike"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in like API:', error);
    
    if (error.message === 'Already liked') {
      return NextResponse.json(
        { error: 'Post already liked' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process like action' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const isLiked = await checkPostLiked(postId);
    
    return NextResponse.json({ isLiked });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}
