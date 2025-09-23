"use client";

import React, { useState } from 'react';
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { useSettings } from '@/contexts/settings-context';
import { PageSkeleton } from "@/components/admin/sidebar-skeleton";

export default function GeneralSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  
  // Local form state - only content settings
  const [formData, setFormData] = useState(() => ({
    posts_per_page: 10,
    enable_comments: true,
    social_sharing: true,
  }));

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        posts_per_page: settings.posts_per_page || 10,
        enable_comments: settings.enable_comments ?? true,
        social_sharing: settings.social_sharing ?? true,
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
        description: "General settings saved successfully!",
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
    return <PageSkeleton showHeader showStats={false} showCards cardCount={2} showTable={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground">
            Configure content publishing settings and site behavior.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Content Settings Card */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">Content Settings</CardTitle>
          <CardDescription className="text-base">
            Configure how content is displayed and behaves on your blog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="posts_per_page">Posts Per Page</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="posts_per_page"
                type="number"
                min="1"
                max="50"
                value={formData.posts_per_page}
                onChange={(e) => setFormData(prev => ({ ...prev, posts_per_page: parseInt(e.target.value) || 10 }))}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Number of posts to display per page on your blog
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-6">
            <div className="flex items-start justify-between py-2">
              <div className="space-y-1">
                <Label>Enable Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow readers to comment on your blog posts
                </p>
              </div>
              <Switch
                checked={formData.enable_comments}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_comments: checked }))}
              />
            </div>
            
            <div className="flex items-start justify-between py-2">
              <div className="space-y-1">
                <Label>Social Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Show social media sharing buttons on posts
                </p>
              </div>
              <Switch
                checked={formData.social_sharing}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, social_sharing: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
