import { createClient } from '@supabase/supabase-js';
import { Comment, CreateCommentData, CommentModerationData, PostWithEngagement } from '@/lib/database/likes-comments-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get user identifier (IP-based for anonymous users)
function getUserIdentifier(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use a combination of localStorage and browser fingerprint
    let identifier = localStorage.getItem('user_identifier');
    if (!identifier) {
      identifier = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_identifier', identifier);
    }
    return identifier;
  }
  
  // Server-side: use IP address (would need to be passed from API route)
  return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST LIKES API
export async function likePost(postId: string): Promise<{ success: boolean; likes_count: number }> {
  try {
    const userIdentifier = getUserIdentifier();
    
    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_identifier: userIdentifier,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined
      });

    if (error) {
      // If it's a duplicate key error, the user already liked this post
      if (error.code === '23505') {
        throw new Error('Already liked');
      }
      throw error;
    }

    // Get updated likes count
    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    return { success: true, likes_count: post?.likes_count || 0 };
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

export async function unlikePost(postId: string): Promise<{ success: boolean; likes_count: number }> {
  try {
    const userIdentifier = getUserIdentifier();
    
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_identifier', userIdentifier);

    if (error) throw error;

    // Get updated likes count
    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    return { success: true, likes_count: post?.likes_count || 0 };
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
}

export async function checkPostLiked(postId: string): Promise<boolean> {
  try {
    const userIdentifier = getUserIdentifier();
    
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_identifier', userIdentifier)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking post like status:', error);
    return false;
  }
}

// COMMENTS API
export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const { data: replies, error: repliesError } = await supabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: true });

        if (repliesError) throw repliesError;

        return {
          ...comment,
          replies: replies || []
        };
      })
    );

    return commentsWithReplies;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(commentData: CreateCommentData): Promise<Comment> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        ...commentData,
        is_approved: false, // Requires moderation
        is_spam: false,
        likes_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// COMMENT LIKES API
export async function likeComment(commentId: string): Promise<{ success: boolean; likes_count: number }> {
  try {
    const userIdentifier = getUserIdentifier();
    
    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_identifier: userIdentifier,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined
      });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Already liked');
      }
      throw error;
    }

    // Get updated likes count
    const { data: comment } = await supabase
      .from('comments')
      .select('likes_count')
      .eq('id', commentId)
      .single();

    return { success: true, likes_count: comment?.likes_count || 0 };
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
}

export async function unlikeComment(commentId: string): Promise<{ success: boolean; likes_count: number }> {
  try {
    const userIdentifier = getUserIdentifier();
    
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_identifier', userIdentifier);

    if (error) throw error;

    // Get updated likes count
    const { data: comment } = await supabase
      .from('comments')
      .select('likes_count')
      .eq('id', commentId)
      .single();

    return { success: true, likes_count: comment?.likes_count || 0 };
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
}

// ADMIN FUNCTIONS (for comment moderation)
export async function getAllComments(includeUnapproved = false): Promise<Comment[]> {
  try {
    let query = supabase
      .from('comments')
      .select(`
        *,
        posts!inner(title, slug)
      `)
      .order('created_at', { ascending: false });

    if (!includeUnapproved) {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching all comments:', error);
    return [];
  }
}

export async function moderateComment(commentId: string, moderationData: CommentModerationData): Promise<Comment> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({
        ...moderationData,
        moderated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error moderating comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

// Get post with engagement data
export async function getPostWithEngagement(slug: string): Promise<PostWithEngagement | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories!inner(id, name, slug, color),
        authors!inner(id, name, email)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    return {
      ...data,
      category: data.categories,
      author: data.authors
    };
  } catch (error) {
    console.error('Error fetching post with engagement:', error);
    return null;
  }
}
