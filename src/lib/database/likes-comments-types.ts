// TypeScript interfaces for likes and comments system

export interface PostLike {
  id: string;
  post_id: string;
  user_identifier: string;
  user_agent?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email?: string;
  user_agent?: string;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  moderated_by?: string;
  moderated_at?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_identifier: string;
  user_agent?: string;
  created_at: string;
}

export interface CreateCommentData {
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email?: string;
  content: string;
  user_agent?: string;
}

export interface CommentModerationData {
  is_approved: boolean;
  is_spam?: boolean;
  moderated_by: string;
}

// Extended Post interface with engagement data
export interface PostWithEngagement {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  tags?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  author?: {
    id: string;
    name: string;
    email: string;
  };
}
