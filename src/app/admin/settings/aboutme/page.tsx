"use client";

import React, { useState } from 'react';
import { Save, Loader2, UserCircle, Heart, MessageSquare, TrendingUp, Coffee, BookOpen, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { useSettings } from '@/contexts/settings-context';
//

export default function AboutMeSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  type TimelineItem = { id: string; year: string; title: string; description: string };
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  
  // Local form state
  const [formData, setFormData] = useState(() => ({
    // Hero Section
    aboutme_hero_greeting: '',
    aboutme_hero_title: '',
    aboutme_hero_subtitle: '',
    
    // Personal Stats
    aboutme_stats_years_value: '',
    aboutme_stats_years_label: '',
    aboutme_stats_articles_value: '',
    aboutme_stats_articles_label: '',
    aboutme_stats_coffee_value: '',
    aboutme_stats_coffee_label: '',
    
    // Story Section
    aboutme_story_title: '',
    aboutme_story_subtitle: '',
    aboutme_story_reality_title: '',
    aboutme_story_reality_content1: '',
    aboutme_story_reality_content2: '',
    // Timeline managed via UI list
    
    // Topics Section
    aboutme_topics_title: '',
    aboutme_topics_subtitle: '',
    
    // Topic Cards
    aboutme_topic_investing_title: '',
    aboutme_topic_investing_description: '',
    aboutme_topic_investing_tags: '',
    aboutme_topic_money_title: '',
    aboutme_topic_money_description: '',
    aboutme_topic_money_tags: '',
    
    // Connect Section
    aboutme_connect_title: '',
    aboutme_connect_subtitle: '',
    aboutme_connect_quote: '',
    
    // Newsletter Section
    aboutme_newsletter_title: '',
    aboutme_newsletter_description: '',
  }));

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        // Hero Section
        aboutme_hero_greeting: settings.aboutme_hero_greeting || '',
        aboutme_hero_title: settings.aboutme_hero_title || '',
        aboutme_hero_subtitle: settings.aboutme_hero_subtitle || '',
        
        // Personal Stats
        aboutme_stats_years_value: settings.aboutme_stats_years_value || '',
        aboutme_stats_years_label: settings.aboutme_stats_years_label || '',
        aboutme_stats_articles_value: settings.aboutme_stats_articles_value || '',
        aboutme_stats_articles_label: settings.aboutme_stats_articles_label || '',
        aboutme_stats_coffee_value: settings.aboutme_stats_coffee_value || '',
        aboutme_stats_coffee_label: settings.aboutme_stats_coffee_label || '',
        
        // Story Section
        aboutme_story_title: settings.aboutme_story_title || '',
        aboutme_story_subtitle: settings.aboutme_story_subtitle || '',
        aboutme_story_reality_title: settings.aboutme_story_reality_title || '',
        aboutme_story_reality_content1: settings.aboutme_story_reality_content1 || '',
        aboutme_story_reality_content2: settings.aboutme_story_reality_content2 || '',
        // Timeline handled via list editor
        
        // Topics Section
        aboutme_topics_title: settings.aboutme_topics_title || '',
        aboutme_topics_subtitle: settings.aboutme_topics_subtitle || '',
        
        // Topic Cards
        aboutme_topic_investing_title: settings.aboutme_topic_investing_title || '',
        aboutme_topic_investing_description: settings.aboutme_topic_investing_description || '',
        aboutme_topic_investing_tags: settings.aboutme_topic_investing_tags || '',
        aboutme_topic_money_title: settings.aboutme_topic_money_title || '',
        aboutme_topic_money_description: settings.aboutme_topic_money_description || '',
        aboutme_topic_money_tags: settings.aboutme_topic_money_tags || '',
        
        // Connect Section
        aboutme_connect_title: settings.aboutme_connect_title || '',
        aboutme_connect_subtitle: settings.aboutme_connect_subtitle || '',
        aboutme_connect_quote: settings.aboutme_connect_quote || '',
        
        // Newsletter Section
        aboutme_newsletter_title: settings.aboutme_newsletter_title || '',
        aboutme_newsletter_description: settings.aboutme_newsletter_description || '',
      });
      // Initialize structured timeline items
      try {
        const raw = (settings as any).aboutme_journey_items;
        let parsed: any[] | null = null;
        if (Array.isArray(raw)) parsed = raw as any[];
        else if (typeof raw === 'string') parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed)) {
          setTimelineItems(
            parsed.map((it: any, i: number) => ({
              id: `${Date.now()}-${i}`,
              year: String(it.year ?? ''),
              title: String(it.title ?? ''),
              description: String(it.description ?? ''),
            }))
          );
        } else {
          setTimelineItems([]);
        }
      } catch {
        setTimelineItems([]);
      }
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Prepare payload with optional parsed flexible timeline
      const toSave: Record<string, unknown> = { ...formData };
      // Prefer structured editor items if provided
      const cleaned = timelineItems
        .map(it => ({ year: String(it.year || '').trim(), title: String(it.title || '').trim(), description: String(it.description || '').trim() }))
        .filter(it => it.year || it.title || it.description);
      if (cleaned.length > 0) {
        toSave.aboutme_journey_items = cleaned;
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: toSave }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
      
      toast({
        title: "Success",
        description: "About Me page settings saved successfully!",
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

  // Timeline helpers
  const addTimelineItem = () => {
    setTimelineItems(prev => [...prev, { id: `n-${Date.now()}`, year: '', title: '', description: '' }]);
  };
  const updateTimelineItem = (id: string, field: keyof Omit<TimelineItem, 'id'>, value: string) => {
    setTimelineItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeTimelineItem = (id: string) => {
    setTimelineItems(prev => prev.filter(it => it.id !== id));
  };
  const moveTimelineItem = (id: string, dir: 'up' | 'down') => {
    setTimelineItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const swapWith = dir === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= newArr.length) return prev;
      const tmp = newArr[idx];
      newArr[idx] = newArr[swapWith];
      newArr[swapWith] = tmp;
      return newArr;
    });
  };

  // Drag & Drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const handleDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch {}
  };
  const handleDragOver = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overId !== id) setOverId(id);
  };
  const handleDrop = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromId = draggingId || (() => { try { return e.dataTransfer.getData('text/plain'); } catch { return null; } })();
    setOverId(null);
    setDraggingId(null);
    if (!fromId || fromId === id) return;
    setTimelineItems(prev => {
      const from = prev.findIndex(it => it.id === fromId);
      const to = prev.findIndex(it => it.id === id);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };
  const handleDragEnd = () => {
    setOverId(null);
    setDraggingId(null);
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
          <h1 className="text-3xl font-bold tracking-tight">About Me Settings</h1>
          <p className="text-muted-foreground">
            Customize your About page content, personal stats, journey timeline, and sections.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>
              Configure the main hero section at the top of your About page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aboutme_hero_greeting">Greeting Text</Label>
                <Input
                  id="aboutme_hero_greeting"
                  value={formData.aboutme_hero_greeting}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_hero_greeting: e.target.value }))}
                  placeholder="Hey, I'm"
                />
                <p className="text-xs text-muted-foreground">
                  The greeting text displayed before your title.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutme_hero_title">Hero Title</Label>
                <Input
                  id="aboutme_hero_title"
                  value={formData.aboutme_hero_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_hero_title: e.target.value }))}
                  placeholder="Your Finance Friend"
                />
                <p className="text-xs text-muted-foreground">
                  The main title displayed prominently in the hero section.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aboutme_hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="aboutme_hero_subtitle"
                value={formData.aboutme_hero_subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutme_hero_subtitle: e.target.value }))}
                placeholder="Just someone who made a lot of financial mistakes so you don't have to. Here's my story."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                The subtitle text below your main title.
              </p>
            </div>
        </CardContent>
      </Card>

      {/* Journey Timeline (Easy Editor) */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Timeline</CardTitle>
          <CardDescription>Manage timeline items with custom years, titles, and descriptions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {timelineItems.length === 0 && (
            <div className="text-sm text-muted-foreground">No items yet. Click "Add Item" to start.</div>
          )}
          <div className="space-y-4">
            {timelineItems.map((it, idx) => (
              <div
                key={it.id}
                className={`rounded-md border p-4 ${overId === it.id ? 'ring-2 ring-primary/50' : ''}`}
                draggable
                onDragStart={handleDragStart(it.id)}
                onDragOver={handleDragOver(it.id)}
                onDrop={handleDrop(it.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-muted-foreground">Item {idx + 1}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => moveTimelineItem(it.id, 'up')} aria-label="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => moveTimelineItem(it.id, 'down')} aria-label="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => removeTimelineItem(it.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor={`ti-year-${it.id}`}>Year</Label>
                    <Input id={`ti-year-${it.id}`} value={it.year} onChange={(e) => updateTimelineItem(it.id, 'year', e.target.value)} placeholder="2012" />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <Label htmlFor={`ti-title-${it.id}`}>Title</Label>
                    <Input id={`ti-title-${it.id}`} value={it.title} onChange={(e) => updateTimelineItem(it.id, 'title', e.target.value)} placeholder="First Investment" />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label htmlFor={`ti-desc-${it.id}`}>Description</Label>
                    <Textarea id={`ti-desc-${it.id}`} rows={3} value={it.description} onChange={(e) => updateTimelineItem(it.id, 'description', e.target.value)} placeholder="Short description..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addTimelineItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

      {/* JSON editor removed */}

        {/* Personal Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Statistics</CardTitle>
            <CardDescription>
              Configure the three statistics displayed below the hero section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <h5 className="font-medium">Years Investing</h5>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_years_value">Value</Label>
                  <Input
                    id="aboutme_stats_years_value"
                    value={formData.aboutme_stats_years_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_years_value: e.target.value }))}
                    placeholder="12+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_years_label">Label</Label>
                  <Input
                    id="aboutme_stats_years_label"
                    value={formData.aboutme_stats_years_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_years_label: e.target.value }))}
                    placeholder="Years Investing"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <h5 className="font-medium">Articles Written</h5>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_articles_value">Value</Label>
                  <Input
                    id="aboutme_stats_articles_value"
                    value={formData.aboutme_stats_articles_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_articles_value: e.target.value }))}
                    placeholder="150+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_articles_label">Label</Label>
                  <Input
                    id="aboutme_stats_articles_label"
                    value={formData.aboutme_stats_articles_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_articles_label: e.target.value }))}
                    placeholder="Articles Written"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <h5 className="font-medium">Coffee Consumed</h5>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_coffee_value">Value</Label>
                  <Input
                    id="aboutme_stats_coffee_value"
                    value={formData.aboutme_stats_coffee_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_coffee_value: e.target.value }))}
                    placeholder="∞"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutme_stats_coffee_label">Label</Label>
                  <Input
                    id="aboutme_stats_coffee_label"
                    value={formData.aboutme_stats_coffee_label}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_stats_coffee_label: e.target.value }))}
                    placeholder="Coffee Consumed"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Story Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Story Section</CardTitle>
            <CardDescription>
              Configure your personal story section and reality check content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aboutme_story_title">Section Title</Label>
                <Input
                  id="aboutme_story_title"
                  value={formData.aboutme_story_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_story_title: e.target.value }))}
                  placeholder="My Financial Journey"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutme_story_reality_title">Reality Check Title</Label>
                <Input
                  id="aboutme_story_reality_title"
                  value={formData.aboutme_story_reality_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_story_reality_title: e.target.value }))}
                  placeholder="The Reality Check"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aboutme_story_subtitle">Section Subtitle</Label>
              <Textarea
                id="aboutme_story_subtitle"
                value={formData.aboutme_story_subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutme_story_subtitle: e.target.value }))}
                placeholder="Like most people, I learned about money the hard way. Here's how I went from financial disasters to (hopefully) helpful insights."
                rows={2}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Reality Check Content</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutme_story_reality_content1">First Paragraph</Label>
                  <Textarea
                    id="aboutme_story_reality_content1"
                    value={formData.aboutme_story_reality_content1}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_story_reality_content1: e.target.value }))}
                    placeholder="I started investing in 2012 with zero knowledge and maximum confidence..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutme_story_reality_content2">Second Paragraph</Label>
                  <Textarea
                    id="aboutme_story_reality_content2"
                    value={formData.aboutme_story_reality_content2}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_story_reality_content2: e.target.value }))}
                    placeholder="After years of mistakes, research, and slowly figuring things out..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Removed legacy fixed-year timeline editor; using the Timeline editor above */}

        {/* What I Write About */}
        <Card>
          <CardHeader>
            <CardTitle>What I Write About Section</CardTitle>
            <CardDescription>
              Configure the section that describes your writing topics and expertise areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aboutme_topics_title">Section Title</Label>
                <Input
                  id="aboutme_topics_title"
                  value={formData.aboutme_topics_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topics_title: e.target.value }))}
                  placeholder="What I Actually Write About"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutme_topics_subtitle">Section Subtitle</Label>
                <Input
                  id="aboutme_topics_subtitle"
                  value={formData.aboutme_topics_subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topics_subtitle: e.target.value }))}
                  placeholder="No fluff, no get-rich-quick schemes..."
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Topic Cards</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h5 className="font-medium">Investing Reality Card</h5>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_investing_title">Title</Label>
                    <Input
                      id="aboutme_topic_investing_title"
                      value={formData.aboutme_topic_investing_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_investing_title: e.target.value }))}
                      placeholder="Investing Reality"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_investing_description">Description</Label>
                    <Textarea
                      id="aboutme_topic_investing_description"
                      value={formData.aboutme_topic_investing_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_investing_description: e.target.value }))}
                      placeholder="Real talk about building wealth through investing..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_investing_tags">Tags (JSON array)</Label>
                    <Input
                      id="aboutme_topic_investing_tags"
                      value={formData.aboutme_topic_investing_tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_investing_tags: e.target.value }))}
                      placeholder='["Portfolio Building", "Risk Management", "Market Psychology"]'
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter tags as a JSON array of strings.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <h5 className="font-medium">Money & Life Card</h5>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_money_title">Title</Label>
                    <Input
                      id="aboutme_topic_money_title"
                      value={formData.aboutme_topic_money_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_money_title: e.target.value }))}
                      placeholder="Money & Life"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_money_description">Description</Label>
                    <Textarea
                      id="aboutme_topic_money_description"
                      value={formData.aboutme_topic_money_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_money_description: e.target.value }))}
                      placeholder="How to handle money without it taking over your life..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutme_topic_money_tags">Tags (JSON array)</Label>
                    <Input
                      id="aboutme_topic_money_tags"
                      value={formData.aboutme_topic_money_tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, aboutme_topic_money_tags: e.target.value }))}
                      placeholder='["Emergency Funds", "Debt Freedom", "Financial Goals"]'
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter tags as a JSON array of strings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Let's Connect & Newsletter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Connect & Newsletter Sections
            </CardTitle>
            <CardDescription>
              Configure the connection call-to-action and newsletter signup sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Let's Connect Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="aboutme_connect_title">Section Title</Label>
                  <Input
                    id="aboutme_connect_title"
                    value={formData.aboutme_connect_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_connect_title: e.target.value }))}
                    placeholder="Let's Connect"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutme_connect_subtitle">Section Subtitle</Label>
                  <Input
                    id="aboutme_connect_subtitle"
                    value={formData.aboutme_connect_subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_connect_subtitle: e.target.value }))}
                    placeholder="Got questions? Want to share your own financial wins or disasters?"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutme_connect_quote">Inspirational Quote</Label>
                <Textarea
                  id="aboutme_connect_quote"
                  value={formData.aboutme_connect_quote}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutme_connect_quote: e.target.value }))}
                  placeholder="The best investment advice I ever got was from someone who admitted their mistakes..."
                  rows={3}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Newsletter Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="aboutme_newsletter_title">Newsletter Title</Label>
                  <Input
                    id="aboutme_newsletter_title"
                    value={formData.aboutme_newsletter_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_newsletter_title: e.target.value }))}
                    placeholder="Join the Journey"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutme_newsletter_description">Newsletter Description</Label>
                  <Textarea
                    id="aboutme_newsletter_description"
                    value={formData.aboutme_newsletter_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutme_newsletter_description: e.target.value }))}
                    placeholder="Get my latest thoughts on investing, money, and life delivered weekly..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
