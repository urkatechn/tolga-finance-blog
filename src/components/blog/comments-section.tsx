"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Send, 
  Reply
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
  gravatar_hash?: string;
  content: string;
  created_at: string;
  parent_id?: string;
  is_approved: boolean;
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  initialComments?: Comment[];
}

interface NewComment {
  author_name: string;
  author_email: string;
  content: string;
  honeypot: string;
}

export default function CommentsSection({ postId, initialComments = [] }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<NewComment>({
    author_name: "",
    author_email: "",
    content: "",
    honeypot: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load comments and user data
  useEffect(() => {
    const loadData = async () => {
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
          // Sort comments by created_at date in descending order (newest first)
          const sortedComments = fetchedComments.sort((a: Comment, b: Comment) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setComments(sortedComments);
          
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);


  // Build Gravatar URL from precomputed hash
  const getGravatarUrlFromHash = (hash?: string, size: number = 40) => {
    if (!hash) return undefined;
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
    const name = newComment.author_name.trim();
    const text = newComment.content.trim();
    const email = newComment.author_email.trim();

    // Client-side validation to match server rules
    if (!name || !text) {
      const { toast } = await import('sonner');
      toast.error('Please provide your name and a comment.');
      return;
    }
    if (name.length > 120) {
      const { toast } = await import('sonner');
      toast.error('Name is too long (max 120 characters).');
      return;
    }
    if (text.length > 4000) {
      const { toast } = await import('sonner');
      toast.error('Comment is too long (max 4000 characters).');
      return;
    }
    if (email) {
      if (email.length > 200) {
        const { toast } = await import('sonner');
        toast.error('Email is too long (max 200 characters).');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const { toast } = await import('sonner');
        toast.error('Please provide a valid email address.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Save user info to localStorage for future comments
      localStorage.setItem('commentUserInfo', JSON.stringify({
        name,
        email
      }));

      // API call to save comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_name: name,
          author_email: email,
          content: text,
          parent_id: parentId,
          honeypot: newComment.honeypot,
        }),
      });

      if (response.ok) {
        // Show success message using toast
        const { toast } = await import('sonner');
        toast.success('Comment submitted!', {
          description: 'Your comment has been submitted and is pending approval.',
        });
        
        // Reset form but keep controlled fields defined
        setNewComment(prev => ({
          author_name: prev.author_name,
          author_email: prev.author_email,
          content: "",
          honeypot: ""
        }));
        
        setReplyingTo(null);
        
        // Refresh comments to show new approved comments
        const commentsResponse = await fetch(`/api/posts/${postId}/comments`);
        if (commentsResponse.ok) {
          const { comments: updatedComments } = await commentsResponse.json();
          // Sort comments by created_at date in descending order (newest first)
          const sortedComments = updatedComments.sort((a: Comment, b: Comment) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setComments(sortedComments);
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


  // (moved to standalone component below to preserve focus)

  return (
    <div id="comments-section" className="mt-16">
      {/* Comments Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            Discussion
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Badge>
            {comments.length > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                Latest first
              </Badge>
            )}
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
      </div>

      {/* Comment Form - Move to top for better UX */}
      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Join the conversation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Share your thoughts and connect with other readers
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmitComment(e)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author_name" className="text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Your Name
                </Label>
                <Input
                  id="author_name"
                  placeholder="Enter your name"
                  value={newComment.author_name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                  className="border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_email" className="text-sm font-medium text-muted-foreground">
                  Email (optional)
                </Label>
                <Input
                  id="author_email"
                  type="email"
                  placeholder="your@email.com"
                  value={newComment.author_email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                  className="border-primary/20 focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                  Used for your profile picture. Never shared publicly.
                </p>
                {/* Honeypot field (hidden) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={newComment.honeypot}
                  onChange={(e) => setNewComment(prev => ({ ...prev, honeypot: e.target.value }))}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Your Comment
              </Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, ask questions, or add your perspective to the discussion..."
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[140px] border-primary/20 focus:border-primary transition-colors resize-none"
                required
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                Your comment will be reviewed before being published
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                By commenting, you agree to our community guidelines.
              </p>
              <Button type="submit" disabled={isSubmitting} className="px-6 py-2.5 font-medium">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-20 bg-muted rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">No comments yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your thoughts and start the discussion!
            </p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('content')?.focus()}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Send className="h-4 w-4 mr-2" />
              Write the first comment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <CommentItemRow
              key={comment.id}
              comment={comment}
              isReply={false}
              isLast={index === comments.length - 1}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              newComment={newComment}
              setNewComment={setNewComment}
              isSubmitting={isSubmitting}
              handleSubmitComment={handleSubmitComment}
              getInitials={getInitials}
              getGravatarUrlFromHash={getGravatarUrlFromHash}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItemRow({
  comment,
  isReply = false,
  isLast = false,
  replyingTo,
  setReplyingTo,
  newComment,
  setNewComment,
  isSubmitting,
  handleSubmitComment,
  getInitials,
  getGravatarUrlFromHash,
}: {
  comment: Comment;
  isReply?: boolean;
  isLast?: boolean;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  newComment: NewComment;
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
  isSubmitting: boolean;
  handleSubmitComment: (e: React.FormEvent, parentId?: string) => Promise<void> | void;
  getInitials: (name: string) => string;
  getGravatarUrlFromHash: (hash?: string, size?: number) => string | undefined;
}) {
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  return (
    <Card className={`${isReply ? 'ml-8 bg-muted/20 border-l-4 border-l-primary/30' : 'hover:shadow-md transition-shadow duration-200'} ${!isLast && !isReply ? 'mb-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <Avatar className={`${isReply ? 'h-10 w-10' : 'h-12 w-12'} ring-2 ring-background shadow-sm`}>
              <AvatarImage 
                src={getGravatarUrlFromHash(comment.gravatar_hash)} 
                alt={`${comment.author_name} avatar`} 
              />
              <AvatarFallback className={`${isReply ? 'text-sm' : 'text-base'} font-medium bg-gradient-to-br from-primary/20 to-primary/30`}>
                {getInitials(comment.author_name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <span className={`font-semibold ${isReply ? 'text-sm' : 'text-base'} text-foreground`}>
                {comment.author_name}
              </span>
              <div className="flex items-center space-x-2">
                <time className="text-sm text-muted-foreground" dateTime={comment.created_at}>
                  {formatDistanceToNow(new Date(comment.created_at))} ago
                </time>
                {!comment.is_approved && (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Pending review
                  </Badge>
                )}
                {isReply && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                    Reply
                  </Badge>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-4">
              <p className={`${isReply ? 'text-sm' : 'text-base'} text-foreground leading-relaxed whitespace-pre-wrap`}>
                {comment.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center space-x-4">
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-muted-foreground hover:text-primary transition-colors h-8 px-3"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                  </Button>
                )}
                {hasReplies && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </div>
            </div>

            {replyingTo === comment.id && (
              <Card className="mt-4 border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Reply className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Replying to {comment.author_name}
                    </span>
                  </div>
                  
                  <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        placeholder="Your name"
                        value={newComment.author_name}
                        onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                        className="border-primary/20 focus:border-primary"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email (optional)"
                        value={newComment.author_email}
                        onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                        className="border-primary/20 focus:border-primary"
                      />
                      {/* Honeypot field (hidden from users) */}
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={newComment.honeypot}
                        onChange={(e) => setNewComment(prev => ({ ...prev, honeypot: e.target.value }))}
                        className="hidden"
                        aria-hidden="true"
                      />
                    </div>
                    <Textarea
                      placeholder="Write your reply..."
                      value={newComment.content}
                      onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[100px] border-primary/20 focus:border-primary resize-none"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Your reply will be reviewed before being published.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:gap-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                          className="order-2 sm:order-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting} className="order-1 sm:order-2">
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-1" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Publish Reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {hasReplies && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <div className="h-px bg-border flex-1" />
                  <span className="px-3 bg-background">
                    {comment.replies!.length} {comment.replies!.length === 1 ? 'Reply' : 'Replies'}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>
                {comment.replies!
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((reply, index) => (
                  <CommentItemRow
                    key={reply.id}
                    comment={reply}
                    isReply={true}
                    isLast={index === comment.replies!.length - 1}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    isSubmitting={isSubmitting}
                    handleSubmitComment={handleSubmitComment}
                    getInitials={getInitials}
                    getGravatarUrlFromHash={getGravatarUrlFromHash}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
