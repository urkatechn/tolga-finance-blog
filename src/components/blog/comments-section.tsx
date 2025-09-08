"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Reply,
  Flag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
  parent_id?: string;
  likes_count: number;
  is_approved: boolean;
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export default function CommentsSection({ postId, initialComments = [] }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({
    author_name: "",
    author_email: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load comments and user data
  useEffect(() => {
    const loadData = async () => {
      // Load liked comments from localStorage
      const liked = JSON.parse(localStorage.getItem('likedComments') || '[]');
      setLikedComments(liked);
      
      // Load user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem('commentUserInfo') || '{}');
      if (userInfo.name) {
        setNewComment(prev => ({
          ...prev,
          author_name: userInfo.name,
          author_email: userInfo.email || ""
        }));
      }

      // Load comments from API
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (response.ok) {
          const { comments: fetchedComments } = await response.json();
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  // Generate Gravatar URL
  const getGravatarUrl = (email: string, size: number = 40) => {
    if (!email) return undefined;
    const hash = btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.author_name.trim()) return;

    setIsSubmitting(true);

    try {
      // Save user info to localStorage for future comments
      localStorage.setItem('commentUserInfo', JSON.stringify({
        name: newComment.author_name,
        email: newComment.author_email
      }));

      // API call to save comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_name: newComment.author_name,
          author_email: newComment.author_email,
          content: newComment.content,
          parent_id: parentId
        }),
      });

      if (response.ok) {
        // Show success message using toast
        const { toast } = await import('sonner');
        toast.success('Comment submitted!', {
          description: 'Your comment has been submitted and is pending approval.',
        });
        
        // Reset form
        setNewComment(prev => ({
          author_name: prev.author_name,
          author_email: prev.author_email,
          content: ""
        }));
        
        setReplyingTo(null);
        
        // Refresh comments to show new approved comments
        const commentsResponse = await fetch(`/api/posts/${postId}/comments`);
        if (commentsResponse.ok) {
          const { comments: updatedComments } = await commentsResponse.json();
          setComments(updatedComments);
        }
      } else {
        const { error } = await response.json();
        const { toast } = await import('sonner');
        toast.error('Failed to submit comment', {
          description: error || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      const { toast } = await import('sonner');
      toast.error('Failed to submit comment', {
        description: 'Please try again later.',
      });
    }

    setIsSubmitting(false);
  };

  const handleLikeComment = async (commentId: string) => {
    const isLiked = likedComments.includes(commentId);
    
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const { likes_count } = await response.json();
        
        // Update local state
        if (isLiked) {
          setLikedComments(prev => prev.filter(id => id !== commentId));
        } else {
          setLikedComments(prev => [...prev, commentId]);
        }

        // Update comment likes count in state
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes_count }
            : {
                ...comment,
                replies: comment.replies?.map(reply => 
                  reply.id === commentId 
                    ? { ...reply, likes_count }
                    : reply
                ) || []
              }
        ));

        // Update localStorage
        const updatedLikes = isLiked 
          ? likedComments.filter(id => id !== commentId)
          : [...likedComments, commentId];
        localStorage.setItem('likedComments', JSON.stringify(updatedLikes));
      } else {
        console.error('Failed to update comment like status');
      }
    } catch (error) {
      console.error('Error updating comment like:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={comment.author_email ? getGravatarUrl(comment.author_email) : undefined} 
          />
          <AvatarFallback className="text-xs">
            {getInitials(comment.author_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-sm">{comment.author_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at))} ago
            </span>
            {!comment.is_approved && (
              <Badge variant="secondary" className="text-xs">Pending approval</Badge>
            )}
          </div>
          
          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center space-x-1 hover:text-foreground transition-colors ${
                likedComments.includes(comment.id) ? 'text-red-500' : ''
              }`}
            >
              <Heart 
                className={`h-3 w-3 ${
                  likedComments.includes(comment.id) ? 'fill-red-500' : ''
                }`} 
              />
              <span>{comment.likes_count}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 hover:text-foreground transition-colors"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
            
            <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
              <Flag className="h-3 w-3" />
              <span>Report</span>
            </button>
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Your name"
                    value={newComment.author_name}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email (optional)"
                    value={newComment.author_email}
                    onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Write your reply..."
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[80px]"
                  required
                />
                <div className="flex space-x-2">
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id="comments-section" className="mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Comment Form */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Join the conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmitComment(e)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Name *</Label>
                <Input
                  id="author_name"
                  placeholder="Your name"
                  value={newComment.author_name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_email">Email (optional)</Label>
                <Input
                  id="author_email"
                  type="email"
                  placeholder="your@email.com"
                  value={newComment.author_email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Used for Gravatar profile picture. Never shared publicly.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Comment *</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or experiences..."
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
