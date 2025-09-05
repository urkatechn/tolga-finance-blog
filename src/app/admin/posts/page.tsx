"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Download, Trash2, Loader2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "./data-table";
import { createColumns, Post } from "./columns";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { BulkDeleteDialog } from './_components/bulk-delete-dialog';
import { DeletePostDialog } from './_components/delete-post-dialog';
import { BulkArchiveDialog } from './_components/bulk-archive-dialog';

interface PostStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<PostStats>({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkArchiving, setIsBulkArchiving] = useState(false);
  const [showBulkArchiveDialog, setShowBulkArchiveDialog] = useState(false);
  const [isArchiveAction, setIsArchiveAction] = useState(true); // true for archive, false for unarchive
  const { toast } = useToast();

  const fetchPosts = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setFetchingPosts(true);
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category_id', categoryFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      
      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data.posts || []);
      
      // Clear selection when posts are refreshed
      if (showLoader) {
        setSelectedPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      if (showLoader) setFetchingPosts(false);
    }
  }, [statusFilter, categoryFilter, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/posts/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchStats(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter changes (except search)
  useEffect(() => {
    if (!loading) {
      fetchPosts(true);
    }
  }, [statusFilter, categoryFilter, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        fetchPosts(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePublishPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'published' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish post');
      }
      
      toast({
        title: "Success",
        description: "Post published successfully!",
      });
      
      // Refresh the data
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post",
        variant: "destructive",
      });
    }
  };

  const handleUnpublishPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'draft' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unpublish post');
      }
      
      toast({
        title: "Success",
        description: "Post unpublished and saved as draft!",
      });
      
      // Refresh the data
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error unpublishing post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unpublish post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePostClick = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setPostToDelete(post);
      setShowDeleteDialog(true);
    }
  };

  const handleDeletePostConfirm = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    setShowDeleteDialog(false);
    
    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      
      // Refresh the data
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleArchivePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'archived' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to archive post');
      }
      
      toast({
        title: "Success",
        description: "Post archived successfully!",
      });
      
      // Refresh the data
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error archiving post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to archive post",
        variant: "destructive",
      });
    }
  };

  const handleUnarchivePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'draft' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unarchive post');
      }
      
      toast({
        title: "Success",
        description: "Post unarchived and saved as draft!",
      });
      
      // Refresh the data
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error unarchiving post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unarchive post",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedPosts.length === 0) {
      return;
    }
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setIsBulkDeleting(true);
    setShowBulkDeleteDialog(false);
    
    try {
      const postIds = selectedPosts.map(post => post.id);
      
      const response = await fetch('/api/posts/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete posts');
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message,
      });
      
      // Clear selection and refresh data
      setSelectedPosts([]);
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error('Error bulk deleting posts:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete posts",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const handleBulkArchiveClick = () => {
    if (selectedPosts.length === 0) return;
    
    const archivedCount = selectedPosts.filter(post => post.status === 'archived').length;
    const isAllArchived = archivedCount === selectedPosts.length;
    
    setIsArchiveAction(!isAllArchived);
    setShowBulkArchiveDialog(true);
  };

  const handleBulkArchiveConfirm = async () => {
    setIsBulkArchiving(true);
    setShowBulkArchiveDialog(false);
    
    try {
      const postIds = selectedPosts.map(post => post.id);
      const targetStatus = isArchiveAction ? 'archived' : 'draft';
      
      const response = await fetch('/api/posts/bulk-archive', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postIds, status: targetStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isArchiveAction ? 'archive' : 'unarchive'} posts`);
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message,
      });
      
      // Clear selection and refresh data
      setSelectedPosts([]);
      await Promise.all([fetchPosts(), fetchStats()]);
    } catch (error) {
      console.error(`Error bulk ${isArchiveAction ? 'archiving' : 'unarchiving'} posts:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isArchiveAction ? 'archive' : 'unarchive'} posts`,
        variant: "destructive",
      });
    } finally {
      setIsBulkArchiving(false);
      setShowBulkArchiveDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-44 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-44 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-md border">
          <div className="h-12 border-b bg-gray-50 animate-pulse"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 border-b animate-pulse">
              <div className="flex items-center space-x-4 p-4">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Loading Overlay for Updates */}
      {fetchingPosts && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">Updating...</span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={loading || fetchingPosts}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild disabled={loading || fetchingPosts}>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Published</p>
            <p className="text-2xl font-bold">{stats.published}</p>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold">{stats.draft}</p>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Archived</p>
            <p className="text-2xl font-bold">{stats.archived}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading || fetchingPosts}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading || fetchingPosts}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={loading || fetchingPosts}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const archivedCount = selectedPosts.filter(post => post.status === 'archived').length;
            const isAllArchived = selectedPosts.length > 0 && archivedCount === selectedPosts.length;
            
            return (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={selectedPosts.length === 0 || loading || fetchingPosts || isBulkArchiving}
                  onClick={handleBulkArchiveClick}
                >
                  {isBulkArchiving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Archive className="mr-2 h-4 w-4" />
                  {isAllArchived 
                    ? `Unarchive ${selectedPosts.length > 0 ? `(${selectedPosts.length})` : ''}` 
                    : `Archive ${selectedPosts.length > 0 ? `(${selectedPosts.length})` : ''}`
                  }
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={selectedPosts.length === 0 || loading || fetchingPosts || isBulkDeleting}
                  onClick={handleBulkDeleteClick}
                >
                  {isBulkDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Trash2 className="mr-2 h-4 w-4" />
                  Bulk Delete {selectedPosts.length > 0 ? `(${selectedPosts.length})` : ''}
                </Button>
              </>
            )
          })()
          }
        </div>
      </div>

      {/* Data Table */}
      <div>
        <DataTable 
          columns={createColumns(
            handlePublishPost, 
            handleUnpublishPost, 
            handleDeletePostClick, 
            handleArchivePost, 
            handleUnarchivePost
          )} 
          data={posts}
          onRowSelectionChange={setSelectedPosts}
        />
      </div>

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        selectedPosts={selectedPosts}
        onConfirm={handleBulkDeleteConfirm}
        isDeleting={isBulkDeleting}
      />

      {/* Single Post Delete Dialog */}
      <DeletePostDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        post={postToDelete}
        onConfirm={handleDeletePostConfirm}
        isDeleting={isDeleting}
      />

      {/* Bulk Archive Dialog */}
      <BulkArchiveDialog
        open={showBulkArchiveDialog}
        onOpenChange={setShowBulkArchiveDialog}
        selectedPosts={selectedPosts}
        onConfirm={handleBulkArchiveConfirm}
        isArchiving={isBulkArchiving}
        isArchive={isArchiveAction}
      />
    </div>
  );
}
