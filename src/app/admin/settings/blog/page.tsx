"use client";

import React, { useState } from 'react';
import { Save, Loader2, Eye, Layout, Search, Palette, Sidebar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { useSettings } from '@/contexts/settings-context';
import { PageSkeleton } from "@/components/admin/sidebar-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function BlogSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  
  // Local form state for blog settings
  const [formData, setFormData] = useState(() => ({
    // Hero Section
    blog_hero_title: "Blog & Insights",
    blog_hero_subtitle: "Discover the latest insights on finance, investing, and building wealth for your future.",
    
    // Content & Layout
    blog_posts_per_page: 12,
    blog_show_featured_separately: true,
    blog_featured_posts_limit: 3,
    blog_enable_sidebar: true,
    blog_recent_posts_limit: 5,
    
    // Stats Display
    blog_show_stats: true,
    blog_stats_articles_label: "Articles",
    blog_stats_categories_label: "Categories",
    blog_stats_featured_label: "Featured",
    
    
    // Section Headers
    blog_featured_section_title: "Featured Articles",
    blog_latest_section_title: "Latest Articles",
    
    // Sidebar Configuration
    sidebar_show_newsletter: true,
    sidebar_newsletter_title: "Stay Updated",
    sidebar_newsletter_description: "Get the latest financial insights delivered to your inbox weekly.",
    sidebar_show_trending: true,
    sidebar_trending_title: "Trending Posts",
    sidebar_trending_limit: 4,
    sidebar_show_categories: true,
    sidebar_categories_title: "Categories",
    sidebar_categories_limit: 8,
    sidebar_show_about: true,
    sidebar_about_title: "About Finance Blog",
    sidebar_about_author_name: "Finance Blog Team",
    sidebar_about_author_role: "Financial Experts",
    sidebar_about_description: "We're passionate about making finance accessible to everyone. Our team of experts shares insights, tips, and strategies to help you make informed financial decisions.",
    sidebar_show_stats: true,
    sidebar_stats_articles: "50+",
    sidebar_stats_readers: "10K+",
    sidebar_stats_categories: "5",
    sidebar_stats_updated: "24/7",
    
    // UI Customization
    blog_show_excerpt: true,
    blog_show_read_time: true,
    blog_show_comment_count: true,
  }));

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        blog_hero_title: settings.blog_hero_title || "Blog & Insights",
        blog_hero_subtitle: settings.blog_hero_subtitle || "Discover the latest insights on finance, investing, and building wealth for your future.",
        
        blog_posts_per_page: settings.blog_posts_per_page || 12,
        blog_show_featured_separately: settings.blog_show_featured_separately ?? true,
        blog_featured_posts_limit: settings.blog_featured_posts_limit || 3,
        blog_enable_sidebar: settings.blog_enable_sidebar ?? true,
        blog_recent_posts_limit: settings.blog_recent_posts_limit || 5,
        
        blog_show_stats: settings.blog_show_stats ?? true,
        blog_stats_articles_label: settings.blog_stats_articles_label || "Articles",
        blog_stats_categories_label: settings.blog_stats_categories_label || "Categories",
        blog_stats_featured_label: settings.blog_stats_featured_label || "Featured",
        
        
        blog_featured_section_title: settings.blog_featured_section_title || "Featured Articles",
        blog_latest_section_title: settings.blog_latest_section_title || "Latest Articles",
        
        // Sidebar Configuration
        sidebar_show_newsletter: settings.sidebar_show_newsletter ?? true,
        sidebar_newsletter_title: settings.sidebar_newsletter_title || "Stay Updated",
        sidebar_newsletter_description: settings.sidebar_newsletter_description || "Get the latest financial insights delivered to your inbox weekly.",
        sidebar_show_trending: settings.sidebar_show_trending ?? true,
        sidebar_trending_title: settings.sidebar_trending_title || "Trending Posts",
        sidebar_trending_limit: settings.sidebar_trending_limit || 4,
        sidebar_show_categories: settings.sidebar_show_categories ?? true,
        sidebar_categories_title: settings.sidebar_categories_title || "Categories",
        sidebar_categories_limit: settings.sidebar_categories_limit || 8,
        sidebar_show_about: settings.sidebar_show_about ?? true,
        sidebar_about_title: settings.sidebar_about_title || "About Finance Blog",
        sidebar_about_author_name: settings.sidebar_about_author_name || "Finance Blog Team",
        sidebar_about_author_role: settings.sidebar_about_author_role || "Financial Experts",
        sidebar_about_description: settings.sidebar_about_description || "We're passionate about making finance accessible to everyone. Our team of experts shares insights, tips, and strategies to help you make informed financial decisions.",
        sidebar_show_stats: settings.sidebar_show_stats ?? true,
        sidebar_stats_articles: settings.sidebar_stats_articles || "50+",
        sidebar_stats_readers: settings.sidebar_stats_readers || "10K+",
        sidebar_stats_categories: settings.sidebar_stats_categories || "5",
        sidebar_stats_updated: settings.sidebar_stats_updated || "24/7",
        
        blog_show_excerpt: settings.blog_show_excerpt ?? true,
        blog_show_read_time: settings.blog_show_read_time ?? true,
        blog_show_comment_count: settings.blog_show_comment_count ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: formData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
      
      toast({
        title: "Success",
        description: "Blog settings saved successfully!",
      });
      
      // Refresh settings context
      await refreshSettings();
      
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

  if (loading || !settings) {
    return <PageSkeleton showHeader showStats={false} showCards cardCount={3} showTable={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Settings</h1>
          <p className="text-muted-foreground">
            Configure the appearance and behavior of your blog page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="sidebar" className="flex items-center gap-2">
            <Sidebar className="h-4 w-4" />
            Sidebar
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Visual
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Customize the hero section that appears at the top of your blog page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog_hero_title">Hero Title</Label>
                  <Input
                    id="blog_hero_title"
                    value={formData.blog_hero_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, blog_hero_title: e.target.value }))}
                    placeholder="Blog & Insights"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blog_hero_subtitle">Hero Subtitle</Label>
                  <Textarea
                    id="blog_hero_subtitle"
                    value={formData.blog_hero_subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, blog_hero_subtitle: e.target.value }))}
                    placeholder="Discover the latest insights..."
                    rows={3}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Statistics</Label>
                    <p className="text-sm text-muted-foreground">
                      Display article count, categories, and featured posts stats in hero
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_show_stats}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_show_stats: checked }))}
                  />
                </div>
                
                {formData.blog_show_stats && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="blog_stats_articles_label">Articles Label</Label>
                      <Input
                        id="blog_stats_articles_label"
                        value={formData.blog_stats_articles_label}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog_stats_articles_label: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog_stats_categories_label">Categories Label</Label>
                      <Input
                        id="blog_stats_categories_label"
                        value={formData.blog_stats_categories_label}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog_stats_categories_label: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog_stats_featured_label">Featured Label</Label>
                      <Input
                        id="blog_stats_featured_label"
                        value={formData.blog_stats_featured_label}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog_stats_featured_label: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout & Navigation</CardTitle>
              <CardDescription>
                Configure the layout and navigation options for your blog page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog_posts_per_page">Posts Per Page</Label>
                  <Input
                    id="blog_posts_per_page"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.blog_posts_per_page}
                    onChange={(e) => setFormData(prev => ({ ...prev, blog_posts_per_page: parseInt(e.target.value) || 12 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blog_recent_posts_limit">Recent Posts (Sidebar)</Label>
                  <Input
                    id="blog_recent_posts_limit"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.blog_recent_posts_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, blog_recent_posts_limit: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Sidebar</Label>
                    <p className="text-sm text-muted-foreground">
                      Display sidebar with recent posts and categories
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_enable_sidebar}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_enable_sidebar: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Posts</CardTitle>
                <CardDescription>
                  Configure how featured posts are displayed on your blog.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Featured Separately</Label>
                    <p className="text-sm text-muted-foreground">
                      Display featured posts in a separate section at the top
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_show_featured_separately}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_show_featured_separately: checked }))}
                  />
                </div>
                
                {formData.blog_show_featured_separately && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="blog_featured_posts_limit">Featured Posts Limit</Label>
                      <Input
                        id="blog_featured_posts_limit"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.blog_featured_posts_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog_featured_posts_limit: parseInt(e.target.value) || 3 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog_featured_section_title">Section Title</Label>
                      <Input
                        id="blog_featured_section_title"
                        value={formData.blog_featured_section_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog_featured_section_title: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Section Headers</CardTitle>
                <CardDescription>
                  Customize the titles for different sections of your blog.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog_latest_section_title">Latest Articles Section Title</Label>
                  <Input
                    id="blog_latest_section_title"
                    value={formData.blog_latest_section_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, blog_latest_section_title: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sidebar Settings */}
        <TabsContent value="sidebar">
          <div className="space-y-6">
            {/* Newsletter Section */}
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Signup</CardTitle>
                <CardDescription>
                  Configure the newsletter subscription section in the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Newsletter Signup</Label>
                    <p className="text-sm text-muted-foreground">
                      Display newsletter subscription form in sidebar
                    </p>
                  </div>
                  <Switch
                    checked={formData.sidebar_show_newsletter}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sidebar_show_newsletter: checked }))}
                  />
                </div>
                
                {formData.sidebar_show_newsletter && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_newsletter_title">Newsletter Title</Label>
                      <Input
                        id="sidebar_newsletter_title"
                        value={formData.sidebar_newsletter_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_newsletter_title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_newsletter_description">Newsletter Description</Label>
                      <Textarea
                        id="sidebar_newsletter_description"
                        value={formData.sidebar_newsletter_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_newsletter_description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Trending Posts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Posts</CardTitle>
                <CardDescription>
                  Configure the recent/trending posts section in the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Trending Posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Display recent posts list in sidebar
                    </p>
                  </div>
                  <Switch
                    checked={formData.sidebar_show_trending}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sidebar_show_trending: checked }))}
                  />
                </div>
                
                {formData.sidebar_show_trending && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_trending_title">Section Title</Label>
                      <Input
                        id="sidebar_trending_title"
                        value={formData.sidebar_trending_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_trending_title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_trending_limit">Posts Limit</Label>
                      <Input
                        id="sidebar_trending_limit"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.sidebar_trending_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_trending_limit: parseInt(e.target.value) || 4 }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Categories Section */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Configure the categories section in the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Categories</Label>
                    <p className="text-sm text-muted-foreground">
                      Display categories list in sidebar
                    </p>
                  </div>
                  <Switch
                    checked={formData.sidebar_show_categories}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sidebar_show_categories: checked }))}
                  />
                </div>
                
                {formData.sidebar_show_categories && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_categories_title">Section Title</Label>
                      <Input
                        id="sidebar_categories_title"
                        value={formData.sidebar_categories_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_categories_title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_categories_limit">Categories Limit</Label>
                      <Input
                        id="sidebar_categories_limit"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.sidebar_categories_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_categories_limit: parseInt(e.target.value) || 8 }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>
                  Configure the about section in the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show About Section</Label>
                    <p className="text-sm text-muted-foreground">
                      Display about information in sidebar
                    </p>
                  </div>
                  <Switch
                    checked={formData.sidebar_show_about}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sidebar_show_about: checked }))}
                  />
                </div>
                
                {formData.sidebar_show_about && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_about_title">Section Title</Label>
                      <Input
                        id="sidebar_about_title"
                        value={formData.sidebar_about_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_about_title: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sidebar_about_author_name">Author Name</Label>
                        <Input
                          id="sidebar_about_author_name"
                          value={formData.sidebar_about_author_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, sidebar_about_author_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sidebar_about_author_role">Author Role</Label>
                        <Input
                          id="sidebar_about_author_role"
                          value={formData.sidebar_about_author_role}
                          onChange={(e) => setFormData(prev => ({ ...prev, sidebar_about_author_role: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_about_description">Description</Label>
                      <Textarea
                        id="sidebar_about_description"
                        value={formData.sidebar_about_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_about_description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>
                  Configure the statistics display in the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Statistics</Label>
                    <p className="text-sm text-muted-foreground">
                      Display quick statistics in sidebar
                    </p>
                  </div>
                  <Switch
                    checked={formData.sidebar_show_stats}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sidebar_show_stats: checked }))}
                  />
                </div>
                
                {formData.sidebar_show_stats && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_stats_articles">Articles Count</Label>
                      <Input
                        id="sidebar_stats_articles"
                        value={formData.sidebar_stats_articles}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_stats_articles: e.target.value }))}
                        placeholder="50+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_stats_readers">Readers Count</Label>
                      <Input
                        id="sidebar_stats_readers"
                        value={formData.sidebar_stats_readers}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_stats_readers: e.target.value }))}
                        placeholder="10K+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_stats_categories">Categories Count</Label>
                      <Input
                        id="sidebar_stats_categories"
                        value={formData.sidebar_stats_categories}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_stats_categories: e.target.value }))}
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sidebar_stats_updated">Update Frequency</Label>
                      <Input
                        id="sidebar_stats_updated"
                        value={formData.sidebar_stats_updated}
                        onChange={(e) => setFormData(prev => ({ ...prev, sidebar_stats_updated: e.target.value }))}
                        placeholder="24/7"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Visual Settings */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Post Card Display</CardTitle>
              <CardDescription>
                Configure what information is displayed on each post card.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Post Excerpts</Label>
                    <p className="text-sm text-muted-foreground">
                      Display post excerpts in the blog listing
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_show_excerpt}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_show_excerpt: checked }))}
                  />
                </div>
                
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Reading Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Display estimated reading time for posts
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_show_read_time}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_show_read_time: checked }))}
                  />
                </div>
                
                <div className="flex items-start justify-between py-2">
                  <div className="space-y-1">
                    <Label>Show Comment Count</Label>
                    <p className="text-sm text-muted-foreground">
                      Display comment counts on post cards
                    </p>
                  </div>
                  <Switch
                    checked={formData.blog_show_comment_count}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blog_show_comment_count: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}