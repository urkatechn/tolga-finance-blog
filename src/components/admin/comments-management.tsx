"use client";

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Check, 
  Trash2, 
  MessageCircle, 
  AlertTriangle,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email?: string;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  moderated_by?: string;
  moderated_at?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  posts?: {
    title: string;
    slug: string;
  };
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/comments?filter=' + filter);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        console.error('Failed to fetch comments');
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const moderateComment = async (commentId: string, action: 'approve' | 'spam' | 'delete') => {
    try {
      let endpoint = '';
      let method = 'POST';
      let body = {};

      switch (action) {
        case 'approve':
          endpoint = `/api/admin/comments/${commentId}/moderate`;
          body = { is_approved: true, is_spam: false };
          break;
        case 'spam':
          endpoint = `/api/admin/comments/${commentId}/moderate`;
          body = { is_approved: false, is_spam: true };
          break;
        case 'delete':
          endpoint = `/api/admin/comments/${commentId}`;
          method = 'DELETE';
          break;
      }

      console.log(`Making ${method} request to ${endpoint}`, body);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'DELETE' ? undefined : JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        // Show success message
        const { toast } = await import('sonner');
        toast.success(`Comment ${action === 'approve' ? 'approved' : action === 'spam' ? 'marked as spam' : 'deleted'} successfully!`);

        if (action === 'delete') {
          setComments(prev => prev.filter(c => c.id !== commentId));
        } else {
          setComments(prev => prev.map(c => 
            c.id === commentId 
              ? { ...c, is_approved: action === 'approve', is_spam: action === 'spam' }
              : c
          ));
        }
      } else {
        console.error('Failed to moderate comment:', responseData);
        const { toast } = await import('sonner');
        toast.error(`Failed to ${action} comment: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error moderating comment:', error);
      const { toast } = await import('sonner');
      toast.error(`Error ${action}ing comment. Please try again.`);
    }
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.is_spam) {
      return <Badge variant="destructive">Spam</Badge>;
    }
    if (comment.is_approved) {
      return <Badge variant="default">Approved</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getGravatarUrl = (email: string) => {
    const hash = btoa(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=32`;
  };

  const filteredComments = comments.filter(comment => {
    switch (filter) {
      case 'pending':
        return !comment.is_approved && !comment.is_spam;
      case 'approved':
        return comment.is_approved;
      case 'spam':
        return comment.is_spam;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Comments Management</h1>
        </div>
        
        {/* Filter tabs skeleton */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
        
        {/* Comments skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments Management</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'approved', 'spam'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption}
              {filterOption === 'pending' && (
                <Badge variant="secondary" className="ml-2">
                  {comments.filter(c => !c.is_approved && !c.is_spam).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading comments...</div>
      ) : filteredComments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments found for the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={comment.author_email ? getGravatarUrl(comment.author_email) : undefined} 
                      />
                      <AvatarFallback className="text-xs">
                        {comment.author_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.author_name}</span>
                        {getStatusBadge(comment)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {comment.author_email && (
                          <span>{comment.author_email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{formatDistanceToNow(new Date(comment.created_at))} ago</div>
                    {comment.posts && (
                      <div className="mt-1">
                        On: <span className="font-medium">{comment.posts.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{comment.likes_count} likes</span>
                    {comment.parent_id && (
                      <Badge variant="outline">Reply</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!comment.is_approved && !comment.is_spam && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateComment(comment.id, 'approve')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateComment(comment.id, 'spam')}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Spam
                        </Button>
                      </>
                    )}
                    
                    {comment.is_spam && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moderateComment(comment.id, 'approve')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Not Spam
                      </Button>
                    )}
                    
                    {comment.is_approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moderateComment(comment.id, 'spam')}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </Button>
                    )}
                    
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => moderateComment(comment.id, 'delete')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
