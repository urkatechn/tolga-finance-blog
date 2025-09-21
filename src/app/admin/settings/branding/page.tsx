"use client";

import React, { useState } from 'react';
import { Save, Loader2, Upload, Palette, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { useSettings } from '@/contexts/settings-context';
import { MediaPicker } from '@/components/admin/media-picker';

export default function BrandingSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [showLogoMediaPicker, setShowLogoMediaPicker] = useState(false);
  const [showFaviconMediaPicker, setShowFaviconMediaPicker] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState(() => ({
    // Site Identity & Header
    site_brand_name: '',
    site_brand_initials: '',
    site_logo_url: '',
    site_favicon_url: '',
    site_description: '',
    
    // Hero Section Content
    hero_title: '',
    hero_subtitle_primary: '',
    hero_subtitle_secondary: '',
    hero_cta_primary_text: '',
    hero_cta_primary_link: '',
    hero_cta_secondary_text: '',
    hero_cta_secondary_link: '',
    
    // Hero Stats
    hero_stats_articles_count: '',
    hero_stats_articles_label: '',
    hero_stats_subscribers_count: '',
    hero_stats_subscribers_label: '',
    hero_stats_success_count: '',
    hero_stats_success_label: '',
    
    // Colors
    brand_primary_color: '#3B82F6',
    brand_secondary_color: '#10B981',
    brand_accent_color: '#8B5CF6',
  }));

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        // Site Identity & Header
        site_brand_name: settings.site_brand_name || '',
        site_brand_initials: settings.site_brand_initials || '',
        site_logo_url: settings.site_logo_url || '',
        site_favicon_url: settings.site_favicon_url || '',
        site_description: settings.site_description || '',
        
        // Hero Section Content
        hero_title: settings.hero_title || '',
        hero_subtitle_primary: settings.hero_subtitle_primary || '',
        hero_subtitle_secondary: settings.hero_subtitle_secondary || '',
        hero_cta_primary_text: settings.hero_cta_primary_text || '',
        hero_cta_primary_link: settings.hero_cta_primary_link || '',
        hero_cta_secondary_text: settings.hero_cta_secondary_text || '',
        hero_cta_secondary_link: settings.hero_cta_secondary_link || '',
        
        // Hero Stats
        hero_stats_articles_count: settings.hero_stats_articles_count || '',
        hero_stats_articles_label: settings.hero_stats_articles_label || '',
        hero_stats_subscribers_count: settings.hero_stats_subscribers_count || '',
        hero_stats_subscribers_label: settings.hero_stats_subscribers_label || '',
        hero_stats_success_count: settings.hero_stats_success_count || '',
        hero_stats_success_label: settings.hero_stats_success_label || '',
        
        // Colors
        brand_primary_color: settings.brand_primary_color || '#3B82F6',
        brand_secondary_color: settings.brand_secondary_color || '#10B981',
        brand_accent_color: settings.brand_accent_color || '#8B5CF6',
      });
    }
  }, [settings]);

  const handleLogoSelect = (file: { id: string; name: string; url: string; size: number; type: string; created_at: string }) => {
    setFormData(prev => ({ ...prev, site_logo_url: file.url }));
    toast({
      title: "Success",
      description: "Logo selected successfully!",
    });
  };

  const handleFaviconSelect = (file: { id: string; name: string; url: string; size: number; type: string; created_at: string }) => {
    setFormData(prev => ({ ...prev, site_favicon_url: file.url }));
    toast({
      title: "Success",
      description: "Favicon selected successfully!",
    });
  };

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
        description: "Branding settings saved successfully!",
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
          <h1 className="text-3xl font-bold tracking-tight">Branding Settings</h1>
          <p className="text-muted-foreground">
            Customize your site&apos;s visual identity, header, logo, and hero section content.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header & Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Header & Logo
            </CardTitle>
            <CardDescription>
              Configure your site&apos;s title, brand identity, logo, and header elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brand Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_brand_name">Brand Name</Label>
                <Input
                  id="site_brand_name"
                  value={formData.site_brand_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_brand_name: e.target.value }))}
                  placeholder="Finance Blog"
                />
                <p className="text-xs text-muted-foreground">
                  The brand name displayed in the header and footer.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_brand_initials">Brand Initials</Label>
                <Input
                  id="site_brand_initials"
                  value={formData.site_brand_initials}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_brand_initials: e.target.value }))}
                  placeholder="FB"
                  maxLength={3}
                />
                <p className="text-xs text-muted-foreground">
                  Initials shown in the logo when no custom logo is set.
                </p>
              </div>
            </div>
            
            {/* Site Description */}
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={formData.site_description}
                onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder="Your guide to financial freedom and wealth building"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                The description displayed in the footer and used for SEO.
              </p>
            </div>
            
            <Separator />
            
            {/* Logo and Favicon Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Site Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.site_logo_url ? (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={formData.site_logo_url} 
                        alt="Logo preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setShowLogoMediaPicker(true)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Logo
                    </Button>
                    {formData.site_logo_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, site_logo_url: '' }))}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Select from media library or upload a new image.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  {formData.site_favicon_url ? (
                    <div className="w-8 h-8 border rounded overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={formData.site_favicon_url} 
                        alt="Favicon preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 border rounded overflow-hidden bg-muted flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFaviconMediaPicker(true)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Favicon
                    </Button>
                    {formData.site_favicon_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, site_favicon_url: '' }))}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: ICO format, 32x32 pixels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Brand Colors Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Brand Colors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand_primary_color">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={formData.brand_primary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_primary_color: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={formData.brand_primary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_primary_color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand_secondary_color">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={formData.brand_secondary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_secondary_color: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={formData.brand_secondary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_secondary_color: e.target.value }))}
                      placeholder="#10B981"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand_accent_color">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={formData.brand_accent_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_accent_color: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={formData.brand_accent_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_accent_color: e.target.value }))}
                      placeholder="#8B5CF6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Hero Section Content */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Content</CardTitle>
            <CardDescription>
              Configure the main hero section that appears on your homepage - headlines, descriptions, and call-to-action buttons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Headlines */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Headlines</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Main Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={formData.hero_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                    placeholder="Smart Financial Insights & Analysis"
                  />
                  <p className="text-xs text-muted-foreground">
                    The main headline displayed prominently in the hero section.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle_primary">Primary Subtitle</Label>
                  <Input
                    id="hero_subtitle_primary"
                    value={formData.hero_subtitle_primary}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle_primary: e.target.value }))}
                    placeholder="No need to endlessly search the internet anymore"
                  />
                  <p className="text-xs text-muted-foreground">
                    The first subtitle line below the main title.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle_secondary">Secondary Description</Label>
                  <Textarea
                    id="hero_subtitle_secondary"
                    value={formData.hero_subtitle_secondary}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle_secondary: e.target.value }))}
                    placeholder="Let us identify and explain the important financial issues for you. Get expert insights on investing, personal finance, and market trends."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    The detailed description text in the hero section.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Call to Action Buttons */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Call-to-Action Buttons</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium">Primary Button</h5>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_primary_text">Button Text</Label>
                    <Input
                      id="hero_cta_primary_text"
                      value={formData.hero_cta_primary_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_cta_primary_text: e.target.value }))}
                      placeholder="Read Latest Articles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_primary_link">Button Link</Label>
                    <Input
                      id="hero_cta_primary_link"
                      value={formData.hero_cta_primary_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_cta_primary_link: e.target.value }))}
                      placeholder="/blog"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium">Secondary Button</h5>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_secondary_text">Button Text</Label>
                    <Input
                      id="hero_cta_secondary_text"
                      value={formData.hero_cta_secondary_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_cta_secondary_text: e.target.value }))}
                      placeholder="Get Weekly Insights"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_secondary_link">Button Link</Label>
                    <Input
                      id="hero_cta_secondary_link"
                      value={formData.hero_cta_secondary_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_cta_secondary_link: e.target.value }))}
                      placeholder="#newsletter"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Hero Stats */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Hero Statistics</h4>
              <p className="text-sm text-muted-foreground">Configure the three statistics displayed in the hero section.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium">Articles Stat</h5>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_articles_count">Count</Label>
                    <Input
                      id="hero_stats_articles_count"
                      value={formData.hero_stats_articles_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_articles_count: e.target.value }))}
                      placeholder="150+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_articles_label">Label</Label>
                    <Input
                      id="hero_stats_articles_label"
                      value={formData.hero_stats_articles_label}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_articles_label: e.target.value }))}
                      placeholder="Expert Articles"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium">Subscribers Stat</h5>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_subscribers_count">Count</Label>
                    <Input
                      id="hero_stats_subscribers_count"
                      value={formData.hero_stats_subscribers_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_subscribers_count: e.target.value }))}
                      placeholder="25K+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_subscribers_label">Label</Label>
                    <Input
                      id="hero_stats_subscribers_label"
                      value={formData.hero_stats_subscribers_label}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_subscribers_label: e.target.value }))}
                      placeholder="Subscribers"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium">Success Rate Stat</h5>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_success_count">Count</Label>
                    <Input
                      id="hero_stats_success_count"
                      value={formData.hero_stats_success_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_success_count: e.target.value }))}
                      placeholder="98%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_stats_success_label">Label</Label>
                    <Input
                      id="hero_stats_success_label"
                      value={formData.hero_stats_success_label}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_stats_success_label: e.target.value }))}
                      placeholder="Success Rate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Media Pickers */}
      <MediaPicker
        open={showLogoMediaPicker}
        onOpenChange={setShowLogoMediaPicker}
        onSelect={handleLogoSelect}
        title="Select Logo"
        description="Choose an image for your site logo from the media library or upload a new one."
      />
      
      <MediaPicker
        open={showFaviconMediaPicker}
        onOpenChange={setShowFaviconMediaPicker}
        onSelect={handleFaviconSelect}
        title="Select Favicon"
        description="Choose an image for your favicon from the media library or upload a new one."
      />
    </div>
  );
}
