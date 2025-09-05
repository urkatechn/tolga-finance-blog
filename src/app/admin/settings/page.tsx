"use client";

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Settings, User, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DeleteAuthorDialog } from './_components/delete-author-dialog';

interface Author {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  social_links: Record<string, string>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface Settings {
  site_title: string;
  site_description: string;
  default_author_id: string;
  posts_per_page: number;
  enable_comments: boolean;
  social_sharing: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_title: '',
    site_description: '',
    default_author_id: '',
    posts_per_page: 10,
    enable_comments: true,
    social_sharing: true,
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    bio: '',
    avatar_url: '',
    website_url: '',
    is_default: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [updatingAuthor, setUpdatingAuthor] = useState(false);
  const [deletingAuthor, setDeletingAuthor] = useState<string | null>(null);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      setSettings({
        site_title: data.site_title || '',
        site_description: data.site_description || '',
        default_author_id: data.default_author_id || '',
        posts_per_page: data.posts_per_page || 10,
        enable_comments: data.enable_comments || true,
        social_sharing: data.social_sharing || true,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch('/api/authors');
      if (!response.ok) throw new Error('Failed to fetch authors');
      
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast({
        title: "Error",
        description: "Failed to load authors",
        variant: "destructive",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchAuthors()]);
      setLoading(false);
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
      
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitAuthor = async () => {
    if (editingAuthor) {
      await handleUpdateAuthor();
    } else {
      await handleCreateAuthor();
    }
  };

  const handleCreateAuthor = async () => {
    setCreatingAuthor(true);
    
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create author');
      }
      
      const createdAuthor = await response.json();
      
      toast({
        title: "Success",
        description: "Author created successfully!",
      });
      
      // Reset form and refresh authors
      setNewAuthor({
        name: '',
        email: '',
        bio: '',
        avatar_url: '',
        website_url: '',
        is_default: false,
      });
      setShowNewAuthorForm(false);
      await fetchAuthors();
      
      // If this was set as default, update settings
      if (newAuthor.is_default) {
        setSettings(prev => ({ ...prev, default_author_id: createdAuthor.id }));
      }
    } catch (error) {
      console.error('Error creating author:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create author",
        variant: "destructive",
      });
    } finally {
      setCreatingAuthor(false);
    }
  };

  const handleSetDefaultAuthor = async (authorId: string) => {
    try {
      // Update the author to be default
      const response = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...authors.find(a => a.id === authorId),
          is_default: true 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set default author');
      }
      
      // Update settings
      setSettings(prev => ({ ...prev, default_author_id: authorId }));
      await fetchAuthors();
      
      toast({
        title: "Success",
        description: "Default author updated successfully!",
      });
    } catch (error) {
      console.error('Error setting default author:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set default author",
        variant: "destructive",
      });
    }
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setNewAuthor({
      name: author.name,
      email: author.email || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      website_url: author.website_url || '',
      is_default: author.is_default,
    });
    setShowNewAuthorForm(true);
  };

  const handleUpdateAuthor = async () => {
    if (!editingAuthor) return;
    
    setUpdatingAuthor(true);
    
    try {
      const response = await fetch(`/api/authors/${editingAuthor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update author');
      }
      
      const updatedAuthor = await response.json();
      
      toast({
        title: "Success",
        description: "Author updated successfully!",
      });
      
      // Reset form and refresh authors
      setNewAuthor({
        name: '',
        email: '',
        bio: '',
        avatar_url: '',
        website_url: '',
        is_default: false,
      });
      setEditingAuthor(null);
      setShowNewAuthorForm(false);
      await fetchAuthors();
      
      // If this was set as default, update settings
      if (newAuthor.is_default) {
        setSettings(prev => ({ ...prev, default_author_id: updatedAuthor.id }));
      }
    } catch (error) {
      console.error('Error updating author:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update author",
        variant: "destructive",
      });
    } finally {
      setUpdatingAuthor(false);
    }
  };

  const handleDeleteAuthorClick = (author: Author) => {
    setAuthorToDelete(author);
    setShowDeleteDialog(true);
  };

  const handleDeleteAuthorConfirm = async () => {
    if (!authorToDelete) return;
    
    setDeletingAuthor(authorToDelete.id);
    setShowDeleteDialog(false);
    
    try {
      const response = await fetch(`/api/authors/${authorToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete author');
      }
      
      toast({
        title: "Success",
        description: "Author deleted successfully!",
      });
      
      await fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete author",
        variant: "destructive",
      });
    } finally {
      setDeletingAuthor(null);
      setAuthorToDelete(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAuthor(null);
    setShowNewAuthorForm(false);
    setNewAuthor({
      name: '',
      email: '',
      bio: '',
      avatar_url: '',
      website_url: '',
      is_default: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your blog settings and configuration.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20 p-1 h-11">
          <TabsTrigger 
            value="general" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="authors" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <User className="h-4 w-4" />
            Authors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8 mt-8">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Site Information</CardTitle>
              <CardDescription className="text-base">
                Configure basic information about your blog site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site_title" className="text-sm font-medium">
                    Site Title
                  </Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
                    placeholder="Your Blog Title"
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    This appears in the browser title and header of your blog.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description" className="text-sm font-medium">
                    Site Description
                  </Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                    placeholder="A brief description of your blog"
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    A short tagline that describes what your blog is about.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Content Settings</CardTitle>
              <CardDescription className="text-base">
                Configure how content is displayed and behaves on your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="posts_per_page" className="text-sm font-medium">
                  Posts Per Page
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="posts_per_page"
                    type="number"
                    min="1"
                    max="50"
                    value={settings.posts_per_page}
                    onChange={(e) => setSettings(prev => ({ ...prev, posts_per_page: parseInt(e.target.value) || 10 }))}
                    className="w-32 h-10"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of posts to display per page on your blog
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow readers to comment on your blog posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_comments}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_comments: checked }))}
                  />
                </div>
                
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Social Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Show social media sharing buttons on posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.social_sharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, social_sharing: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              size="lg"
              className="px-8"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="authors" className="space-y-8 mt-8">
          <Card>
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">Authors</CardTitle>
                  <CardDescription className="text-base">
                    Manage blog authors and set the default author for new posts.
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowNewAuthorForm(!showNewAuthorForm)}
                  variant="outline"
                  size="default"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Author
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {showNewAuthorForm && (
                <Card className="border-dashed">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">
                      {editingAuthor ? 'Edit Author' : 'Add New Author'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="author_name" className="text-sm font-medium">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="author_name"
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Author name"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author_email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="author_email"
                          type="email"
                          value={newAuthor.email}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="author@example.com"
                          className="h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author_bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      <Textarea
                        id="author_bio"
                        value={newAuthor.bio}
                        onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Brief bio about the author"
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="author_avatar" className="text-sm font-medium">
                          Avatar URL
                        </Label>
                        <Input
                          id="author_avatar"
                          value={newAuthor.avatar_url}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, avatar_url: e.target.value }))}
                          placeholder="https://example.com/avatar.jpg"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author_website" className="text-sm font-medium">
                          Website URL
                        </Label>
                        <Input
                          id="author_website"
                          value={newAuthor.website_url}
                          onChange={(e) => setNewAuthor(prev => ({ ...prev, website_url: e.target.value }))}
                          placeholder="https://example.com"
                          className="h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between py-2 rounded-lg border bg-muted/20 px-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Set as Default Author</Label>
                        <p className="text-sm text-muted-foreground">
                          New posts will automatically use this author
                        </p>
                      </div>
                      <Switch
                        checked={newAuthor.is_default}
                        onCheckedChange={(checked) => setNewAuthor(prev => ({ ...prev, is_default: checked }))}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={creatingAuthor || updatingAuthor}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmitAuthor} 
                        disabled={(creatingAuthor || updatingAuthor) || !newAuthor.name}
                      >
                        {(creatingAuthor || updatingAuthor) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingAuthor ? 'Update Author' : 'Create Author'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {authors.map((author) => (
                  <div key={author.id} className="flex items-start gap-6 p-6 border rounded-xl hover:shadow-sm transition-shadow">
                    <Avatar className="h-14 w-14 ring-2 ring-muted">
                      <AvatarImage src={author.avatar_url || ''} alt={author.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{author.name}</h3>
                        {author.is_default && (
                          <Badge variant="default" className="text-xs">
                            Default Author
                          </Badge>
                        )}
                      </div>
                      {author.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1 h-1 bg-muted-foreground rounded-full"></span>
                          {author.email}
                        </p>
                      )}
                      {author.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {author.bio}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAuthor(author)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      
                      {!author.is_default && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSetDefaultAuthor(author.id)}
                          className="whitespace-nowrap"
                        >
                          Set as Default
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAuthorClick(author)}
                        disabled={deletingAuthor === author.id}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        {deletingAuthor === author.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {authors.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">No authors found</p>
                    <p className="text-sm text-muted-foreground">Add your first author using the button above.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Delete Author Dialog */}
      <DeleteAuthorDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        author={authorToDelete}
        onConfirm={handleDeleteAuthorConfirm}
        isDeleting={deletingAuthor === authorToDelete?.id}
      />
    </div>
  );
}
