"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Check, 
  Trash2, 
  MessageCircle, 
  AlertTriangle,
  EyeOff,
  MoreVertical,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteCommentDialog } from '@/components/admin/delete-comment-dialog';

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email?: string;
  gravatar_hash?: string;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  moderated_by?: string;
  moderated_at?: string;
  created_at: string;
  updated_at: string;
  posts?: {
    title: string;
    slug: string;
  };
}

interface TreeComment extends Comment {
  replies?: TreeComment[];
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ filter, page: String(page), pageSize: String(pageSize) });
      const response = await fetch('/api/admin/comments?' + params.toString());
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        if (typeof data.total === 'number') setTotal(data.total);
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
  }, [filter, page, pageSize]);

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

  const replyToComment = async (commentId: string) => {
    try {
      if (!replyText.trim()) return;
      const response = await fetch(`/api/admin/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        const { toast } = await import('sonner');
        toast.success('Reply added');
        setReplyText("");
        setReplyingTo(null);
        await fetchComments();
      } else {
        const { toast } = await import('sonner');
        toast.error(data.error || 'Failed to add reply');
      }
    } catch (e) {
      const { toast } = await import('sonner');
      toast.error('Failed to add reply');
    }
  };

  const toggleReplies = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllExpanded = (value: boolean) => {
    const next: Record<string, boolean> = {};
    threadedComments.forEach(c => { next[c.id] = value; });
    setExpanded(next);
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      await moderateComment(commentToDelete.id, 'delete');
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const approveThread = async (root: TreeComment) => {
    try {
      const ids: string[] = [];
      const walk = (node: TreeComment) => {
        if (!node.is_approved && !node.is_spam) ids.push(node.id);
        node.replies?.forEach(walk);
      };
      walk(root);
      if (ids.length === 0) {
        const { toast } = await import('sonner');
        toast.info('No pending comments in this thread.');
        return;
      }
      for (const id of ids) {
        await moderateComment(id, 'approve');
      }
      const { toast } = await import('sonner');
      toast.success(`Approved ${ids.length} pending ${ids.length === 1 ? 'comment' : 'comments'} in thread`);
      await fetchComments();
    } catch (e) {
      const { toast } = await import('sonner');
      toast.error('Failed to approve thread');
    }
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.is_spam) {
      return (
        <Badge className="bg-red-600 text-white dark:bg-red-700">Spam</Badge>
      );
    }
    if (comment.is_approved) {
      return (
        <Badge className="bg-green-600 text-white dark:bg-green-700">Approved</Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 text-white dark:bg-amber-600">Pending</Badge>
    );
  };

  const getGravatarUrlFromHash = (hash?: string) => {
    if (!hash) return undefined;
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

  // Build a threaded tree from filtered (current page) comments
  const threadedComments = useMemo<TreeComment[]>(() => {
    const map = new Map<string, TreeComment>();
    filteredComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    const roots: TreeComment[] = [];
    filteredComments.forEach(c => {
      const item = map.get(c.id)!;
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.replies!.push(item);
      } else {
        roots.push(item);
      }
    });
    return roots;
  }, [filteredComments]);

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold">Comments Management</h2>
        
        {/* Mobile-first responsive controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'spam'] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter(filterOption); setPage(1); }}
                className="capitalize flex-1 sm:flex-none"
              >
                {filterOption}
                {filterOption === 'pending' && (
                  <Badge variant="secondary" className="ml-1 sm:ml-2">
                    {comments.filter(c => !c.is_approved && !c.is_spam).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {/* Additional controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setAllExpanded(true)}>Expand All</Button>
              <Button size="sm" variant="outline" onClick={() => setAllExpanded(false)}>Collapse All</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Per page</span>
              <select
                className="h-9 border rounded-md px-2 text-sm bg-background min-w-[80px]"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {[10, 20, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
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
          {threadedComments.map((comment) => {
            const isAdminReply = !!comment.parent_id && (comment.author_name === 'Admin' || comment.author_name === 'Tolga Tanagardigil');
            const isReply = !!comment.parent_id;
            const isExpanded = expanded[comment.id] ?? true;
            return (
            <Card key={comment.id} className={`${isAdminReply ? 'border-blue-300/60 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20' : ''} shadow-sm hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3 bg-gradient-to-r from-background to-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={getGravatarUrlFromHash(comment.gravatar_hash)}
                        alt={`${comment.author_name} avatar`}
                      />
                      <AvatarFallback className="text-xs">
                        {comment.author_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-medium">{comment.author_name}</span>
                        {getStatusBadge(comment)}
                        {isAdminReply && (
                          <Badge className="bg-blue-600/90 text-white dark:bg-blue-500/80">Admin Reply</Badge>
                        )}
                        {!isAdminReply && isReply && (
                          <Badge className="bg-slate-600/90 text-white dark:bg-slate-500/80">Reply</Badge>
                        )}
                        {!isReply && (
                          <Badge variant="outline">Top-level</Badge>
                        )}
                      </div>
                      {comment.author_email && (
                        <div className="text-xs text-muted-foreground">{comment.author_email}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="mb-1">{formatDistanceToNow(new Date(comment.created_at))} ago</div>
                    {comment.posts && (
                      <div className="flex justify-end">
                        <Badge variant="secondary" className="max-w-[240px] truncate">Post: {comment.posts.title}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
                
                {/* Comment Actions - More visible and clearly associated */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  {/* Mobile-first action layout */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Primary actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {comment.replies && comment.replies.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleReplies(comment.id)}
                          className="inline-flex items-center gap-1 justify-center sm:justify-start"
                        >
                          {expanded[comment.id] ?? true ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {(expanded[comment.id] ?? true) ? 'Hide' : 'Show'} Replies ({comment.replies.length})
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="inline-flex items-center gap-1 justify-center sm:justify-start"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">{replyingTo === comment.id ? 'Cancel Reply' : 'Reply as Admin'}</span>
                        <span className="sm:hidden">Reply</span>
                      </Button>
                    </div>
                    
                    {/* Moderation actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Quick moderation actions */}
                      {!comment.is_approved && !comment.is_spam && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => moderateComment(comment.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                            <span className="sm:hidden">✓</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => moderateComment(comment.id, 'spam')}
                            className="flex-1 sm:flex-none"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Spam</span>
                            <span className="sm:hidden">!</span>
                          </Button>
                        </>
                      )}
                      
                      {comment.is_spam && (
                        <Button
                          size="sm"
                          onClick={() => moderateComment(comment.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Not Spam</span>
                          <span className="sm:hidden">OK</span>
                        </Button>
                      )}
                      
                      {comment.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateComment(comment.id, 'spam')}
                        >
                          <EyeOff className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Hide</span>
                          <span className="sm:hidden">Hide</span>
                        </Button>
                      )}
                      
                      {/* More actions menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="px-2">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions for {comment.author_name}&apos;s comment</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                          <DropdownMenuLabel>Comment by {comment.author_name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {comment.replies && comment.replies.some(r => !r.is_approved && !r.is_spam) && (
                            <>
                              <DropdownMenuItem onClick={() => approveThread(comment)}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve All Pending in Thread
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(comment)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {replyingTo === comment.id && (
                  <div className="mt-4 p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50/30 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Replying as Admin to {comment.author_name}:
                      </span>
                    </div>
                    <textarea
                      className="w-full min-h-[100px] text-sm rounded-md border border-blue-200 dark:border-blue-800 p-3 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Write your admin reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        This will be posted as an admin reply and marked as approved.
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => replyToComment(comment.id)} 
                          disabled={!replyText.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Post Reply
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Render nested replies (current page only) */}
                {isExpanded && comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Replies to this comment:
                    </div>
                    {comment.replies.map(reply => {
                      const replyIsAdmin = reply.author_name === 'Admin' || reply.author_name === 'Tolga Tanagardigil';
                      return (
                        <div key={reply.id} className={`ml-6 p-4 rounded-lg border-l-4 ${replyIsAdmin ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-l-gray-300 bg-gray-50/50 dark:bg-gray-800/30'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={getGravatarUrlFromHash(reply.gravatar_hash)} alt={`${reply.author_name} avatar`} />
                                <AvatarFallback className="text-xs">
                                  {reply.author_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium">{reply.author_name}</span>
                                {replyIsAdmin ? (
                                  <Badge className="bg-blue-600/90 text-white dark:bg-blue-500/80">Admin Reply</Badge>
                                ) : (
                                  <Badge variant="outline">Reply</Badge>
                                )}
                                {reply.is_spam ? (
                                  <Badge className="bg-red-600 text-white dark:bg-red-700">Spam</Badge>
                                ) : reply.is_approved ? (
                                  <Badge className="bg-green-600 text-white dark:bg-green-700">Approved</Badge>
                                ) : (
                                  <Badge className="bg-amber-500 text-white dark:bg-amber-600">Pending</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.created_at))} ago</div>
                          </div>
                          
                          <p className="text-sm mb-3 leading-relaxed">{reply.content}</p>

                          {/* Reply Actions - More visible */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                              className="inline-flex items-center gap-1"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {replyingTo === reply.id ? 'Cancel Reply' : 'Reply'}
                            </Button>
                            
                            <div className="flex items-center gap-2">
                              {/* Quick moderation actions for replies */}
                              {!reply.is_approved && !reply.is_spam && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => moderateComment(reply.id, 'approve')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => moderateComment(reply.id, 'spam')}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Spam
                                  </Button>
                                </>
                              )}
                              
                              {reply.is_spam && (
                                <Button
                                  size="sm"
                                  onClick={() => moderateComment(reply.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Not Spam
                                </Button>
                              )}
                              
                              {reply.is_approved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moderateComment(reply.id, 'spam')}
                                >
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Hide
                                </Button>
                              )}
                              
                              {/* More actions menu for reply */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline" className="px-2">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">More actions for {reply.author_name}&apos;s reply</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-48">
                                  <DropdownMenuLabel>Reply by {reply.author_name}</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(reply)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Reply
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {replyingTo === reply.id && (
                            <div className="mt-3 p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50/30 dark:bg-blue-950/20">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                  Replying as Admin to {reply.author_name}:
                                </span>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] text-sm rounded-md border border-blue-200 dark:border-blue-800 p-3 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Write your admin reply here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                              />
                              <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-blue-700 dark:text-blue-300">
                                  This will be posted as an admin reply and marked as approved.
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => replyToComment(reply.id)} 
                                    disabled={!replyText.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Post Reply
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      )}
      {/* Pagination controls (centered) */}
      <div className="flex items-center justify-center pt-4 pb-8">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(prev => (prev * pageSize >= total ? prev : prev + 1))}
            disabled={page * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Custom Delete Dialog */}
      <DeleteCommentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        comment={commentToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
