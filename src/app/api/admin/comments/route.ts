import { NextRequest, NextResponse } from 'next/server';
import { getAllComments } from '@/lib/api/likes-comments';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const includeUnapproved = filter === 'all' || filter === 'pending' || filter === 'spam';
    
    const comments = await getAllComments(includeUnapproved);
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
