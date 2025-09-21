"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Save, Linkedin, Clock, MessageCircle, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/settings-context";
import { useToast } from "@/hooks/use-toast";

type FaqItem = { id: string; question: string; answer: string };

export default function ContactSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    contact_hero_line1: "",
    contact_hero_title: "",
    contact_hero_subtitle: "",
    contact_linkedin_card_title: "",
    contact_linkedin_card_description: "",
    contact_linkedin_button_text: "",
    contact_response_title: "",
    contact_response_description: "",
    contact_response_time: "",
    contact_form_title: "",
    contact_form_description: "",
    contact_faq_title: "",
    contact_faq_subtitle: "",
    contact_faq_enabled: true,
  });
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [dragFaqId, setDragFaqId] = useState<string | null>(null);
  const [overFaqId, setOverFaqId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!settings) return;
    setFormData({
      contact_hero_line1: settings.contact_hero_line1 || "",
      contact_hero_title: settings.contact_hero_title || "",
      contact_hero_subtitle: settings.contact_hero_subtitle || "",
      contact_linkedin_card_title: settings.contact_linkedin_card_title || "",
      contact_linkedin_card_description: settings.contact_linkedin_card_description || "",
      contact_linkedin_button_text: settings.contact_linkedin_button_text || "",
      contact_response_title: settings.contact_response_title || "",
      contact_response_description: settings.contact_response_description || "",
      contact_response_time: settings.contact_response_time || "",
      contact_form_title: settings.contact_form_title || "",
      contact_form_description: settings.contact_form_description || "",
      contact_faq_title: settings.contact_faq_title || "",
      contact_faq_subtitle: settings.contact_faq_subtitle || "",
      contact_faq_enabled: settings.contact_faq_enabled ?? true,
    });
    const items = Array.isArray((settings as any).contact_faq_items)
      ? ((settings as any).contact_faq_items as Array<{ question: string; answer: string }>).map((it, i) => ({
          id: `${Date.now()}-${i}`,
          question: it.question || "",
          answer: it.answer || "",
        }))
      : [];
    setFaqs(items);
  }, [settings]);

  const addFaq = () => setFaqs((p) => [...p, { id: `n-${Date.now()}`, question: "", answer: "" }]);
  const updateFaq = (id: string, field: keyof Omit<FaqItem, "id">, value: string) =>
    setFaqs((p) => p.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  const removeFaq = (id: string) => setFaqs((p) => p.filter((it) => it.id !== id));
  const moveFaq = (id: string, dir: "up" | "down") =>
    setFaqs((p) => {
      const idx = p.findIndex((it) => it.id === id);
      if (idx === -1) return p;
      const arr = [...p];
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= arr.length) return p;
      const tmp = arr[idx];
      arr[idx] = arr[swapWith];
      arr[swapWith] = tmp;
      return arr;
    });

  // Drag & drop for FAQs
  const onFaqDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDragFaqId(id);
    try { e.dataTransfer.setData('text/plain', id); } catch {}
    e.dataTransfer.effectAllowed = 'move';
  };
  const onFaqDragOver = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overFaqId !== id) setOverFaqId(id);
  };
  const onFaqDrop = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromId = dragFaqId || (() => { try { return e.dataTransfer.getData('text/plain'); } catch { return null; } })();
    setOverFaqId(null);
    setDragFaqId(null);
    if (!fromId || fromId === id) return;
    setFaqs((p) => {
      const from = p.findIndex((it) => it.id === fromId);
      const to = p.findIndex((it) => it.id === id);
      if (from === -1 || to === -1 || from === to) return p;
      const next = [...p];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };
  const onFaqDragEnd = () => {
    setOverFaqId(null);
    setDragFaqId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toSave: Record<string, unknown> = {
        ...formData,
        contact_faq_items: faqs
          .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
          .filter((f) => f.question || f.answer),
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: toSave }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save contact settings");
      }
      toast({ title: "Saved", description: "Contact settings updated." });
      await refreshSettings();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Page Settings</h1>
          <p className="text-muted-foreground">Manage hero, contact methods, form intro, and FAQs.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Primary heading and subtitle at the top.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_hero_line1">Heading Line</Label>
              <Input id="contact_hero_line1" value={formData.contact_hero_line1} onChange={(e) => setFormData((p) => ({ ...p, contact_hero_line1: e.target.value }))} placeholder="Let’s Chat About" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_hero_title">Hero Title</Label>
              <Input id="contact_hero_title" value={formData.contact_hero_title} onChange={(e) => setFormData((p) => ({ ...p, contact_hero_title: e.target.value }))} placeholder="Money & Life" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_hero_subtitle">Subtitle</Label>
            <Textarea id="contact_hero_subtitle" rows={3} value={formData.contact_hero_subtitle} onChange={(e) => setFormData((p) => ({ ...p, contact_hero_subtitle: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Methods</CardTitle>
          <CardDescription>Customize LinkedIn card and response time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Linkedin className="h-4 w-4" /> LinkedIn Card</div>
              <Label htmlFor="contact_linkedin_card_title">Title</Label>
              <Input id="contact_linkedin_card_title" value={formData.contact_linkedin_card_title} onChange={(e) => setFormData((p) => ({ ...p, contact_linkedin_card_title: e.target.value }))} />
              <Label htmlFor="contact_linkedin_card_description">Description</Label>
              <Textarea id="contact_linkedin_card_description" rows={2} value={formData.contact_linkedin_card_description} onChange={(e) => setFormData((p) => ({ ...p, contact_linkedin_card_description: e.target.value }))} />
              <Label htmlFor="contact_linkedin_button_text">Button Text</Label>
              <Input id="contact_linkedin_button_text" value={formData.contact_linkedin_button_text} onChange={(e) => setFormData((p) => ({ ...p, contact_linkedin_button_text: e.target.value }))} />
              <p className="text-xs text-muted-foreground">LinkedIn URL is managed in Social settings.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> Response Time</div>
              <Label htmlFor="contact_response_title">Title</Label>
              <Input id="contact_response_title" value={formData.contact_response_title} onChange={(e) => setFormData((p) => ({ ...p, contact_response_title: e.target.value }))} />
              <Label htmlFor="contact_response_description">Description</Label>
              <Textarea id="contact_response_description" rows={2} value={formData.contact_response_description} onChange={(e) => setFormData((p) => ({ ...p, contact_response_description: e.target.value }))} />
              <Label htmlFor="contact_response_time">Time Value</Label>
              <Input id="contact_response_time" value={formData.contact_response_time} onChange={(e) => setFormData((p) => ({ ...p, contact_response_time: e.target.value }))} placeholder="24-48h" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Intro */}
      <Card>
        <CardHeader>
          <CardTitle>Form Intro</CardTitle>
          <CardDescription>Title and description above the contact form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_form_title">Title</Label>
              <Input id="contact_form_title" value={formData.contact_form_title} onChange={(e) => setFormData((p) => ({ ...p, contact_form_title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_form_description">Description</Label>
              <Textarea id="contact_form_description" rows={2} value={formData.contact_form_description} onChange={(e) => setFormData((p) => ({ ...p, contact_form_description: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>Common questions shown at the bottom of the page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-2">
                <Label htmlFor="contact_faq_title">Section Title</Label>
                <Input id="contact_faq_title" value={formData.contact_faq_title} onChange={(e) => setFormData((p) => ({ ...p, contact_faq_title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_faq_subtitle">Section Subtitle</Label>
                <Input id="contact_faq_subtitle" value={formData.contact_faq_subtitle} onChange={(e) => setFormData((p) => ({ ...p, contact_faq_subtitle: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1 text-right">
                <Label>Show FAQs</Label>
                <p className="text-xs text-muted-foreground">Toggle to show/hide the FAQ section.</p>
              </div>
              <Switch checked={formData.contact_faq_enabled} onCheckedChange={(v) => setFormData((p) => ({ ...p, contact_faq_enabled: v }))} />
            </div>
          </div>

          <div className="space-y-4">
            {faqs.length === 0 && (
              <div className="text-sm text-muted-foreground">No FAQ items. Add one below.</div>
            )}
            {faqs.map((it, idx) => (
              <div
                key={it.id}
                className={`rounded-md border p-4 ${overFaqId === it.id ? 'ring-2 ring-primary/50' : ''}`}
                draggable
                onDragStart={onFaqDragStart(it.id)}
                onDragOver={onFaqDragOver(it.id)}
                onDrop={onFaqDrop(it.id)}
                onDragEnd={onFaqDragEnd}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-muted-foreground">Item {idx + 1}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => moveFaq(it.id, 'up')} aria-label="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => moveFaq(it.id, 'down')} aria-label="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => removeFaq(it.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`faq-q-${it.id}`}>Question</Label>
                    <Input id={`faq-q-${it.id}`} value={it.question} onChange={(e) => updateFaq(it.id, 'question', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-a-${it.id}`}>Answer</Label>
                    <Textarea id={`faq-a-${it.id}`} rows={3} value={it.answer} onChange={(e) => updateFaq(it.id, 'answer', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addFaq}><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
        </CardContent>
      </Card>
    </div>
  );
}
