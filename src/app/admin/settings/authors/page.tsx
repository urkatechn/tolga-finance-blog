"use client";
// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Save, User, Pencil, Trash2, Star } from "lucide-react";
import { DeleteAuthorDialog } from "@/app/admin/settings/_components/delete-author-dialog";
import { useSettings } from "@/contexts/settings-context";
import { PageSkeleton } from "@/components/admin/sidebar-skeleton";

interface Author {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  avatar_url?: string | null;
  website_url?: string | null;
  social_links?: Record<string, string> | null;
  is_default: boolean;
}

export default function AuthorsSettingsPage() {
  const { toast } = useToast();
  const { settings, refreshSettings } = useSettings();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Author, "id" | "is_default"> & { is_default: boolean }>({
    name: "",
    email: "",
    bio: "",
    avatar_url: "",
    website_url: "",
    social_links: {},
    is_default: false,
  });

  const defaultAuthorId = settings?.default_author_id || "";

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/authors");
      if (!res.ok) throw new Error("Failed to load authors");
      const data = await res.json();
      setAuthors(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load authors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setShowCreateForm(true);
    setFormData({
      name: "",
      email: "",
      bio: "",
      avatar_url: "",
      website_url: "",
      social_links: {},
      is_default: authors.length === 0, // first author becomes default by convenience
    });
  };

  const startEdit = (author: Author) => {
    setEditingId(author.id);
    setShowCreateForm(true);
    setFormData({
      name: author.name,
      email: author.email || "",
      bio: author.bio || "",
      avatar_url: author.avatar_url || "",
      website_url: author.website_url || "",
      social_links: author.social_links || {},
      is_default: !!author.is_default,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({
      name: "",
      email: "",
      bio: "",
      avatar_url: "",
      website_url: "",
      social_links: {},
      is_default: false,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        bio: formData.bio?.trim() || null,
        avatar_url: formData.avatar_url?.trim() || null,
        website_url: formData.website_url?.trim() || null,
        social_links: formData.social_links || {},
        is_default: !!formData.is_default,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/authors/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save author");

      // If set as default, update settings.default_author_id for editor defaults
      if (payload.is_default && data?.id) {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: { default_author_id: data.id } }),
        });
        await refreshSettings();
      }

      toast({ title: editingId ? "Author updated" : "Author created" });
      resetForm(); // This now also hides the form
      await fetchAuthors();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to save author", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (author: Author) => {
    setAuthorToDelete(author);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!authorToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/authors/${authorToDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete author");

      // If we deleted the default author, clear default in settings
      if (authorToDelete.is_default && settings?.default_author_id === authorToDelete.id) {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: { default_author_id: "" } }),
        });
        await refreshSettings();
      }

      toast({ title: "Author deleted" });
      await fetchAuthors();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete author", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setAuthorToDelete(null);
    }
  };

  const currentDefault = useMemo(() => authors.find((a) => a.is_default), [authors]);

  if (loading) {
    return <PageSkeleton showHeader showStats={false} showCards cardCount={2} showTable={false} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
          <p className="text-muted-foreground">Manage authors used in post creation and display.</p>
        </div>
        <Button onClick={startCreate} variant="default">
          <Plus className="mr-2 h-4 w-4" /> New Author
        </Button>
      </div>

      {/* Editor - Only shown when creating new or editing */}
      {showCreateForm && (
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5" /> {editingId ? "Edit Author" : "Create Author"}
            </CardTitle>
            <CardDescription className="text-base">
              {editingId ? "Update author details" : "Add a new author profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email || ""} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input id="website_url" placeholder="https://example.com" value={formData.website_url || ""} onChange={(e) => setFormData((p) => ({ ...p, website_url: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input id="avatar_url" placeholder="https://.../avatar.png" value={formData.avatar_url || ""} onChange={(e) => setFormData((p) => ({ ...p, avatar_url: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} placeholder="Short bio shown on posts" value={formData.bio || ""} onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sl_twitter">Twitter/X</Label>
                <Input id="sl_twitter" placeholder="@handle or https://twitter.com/handle" value={(formData.social_links as any)?.twitter || ""} onChange={(e) => setFormData((p) => ({ ...p, social_links: { ...(p.social_links || {}), twitter: e.target.value } }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sl_linkedin">LinkedIn</Label>
                <Input id="sl_linkedin" placeholder="https://linkedin.com/in/username" value={(formData.social_links as any)?.linkedin || ""} onChange={(e) => setFormData((p) => ({ ...p, social_links: { ...(p.social_links || {}), linkedin: e.target.value } }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sl_github">GitHub</Label>
                <Input id="sl_github" placeholder="https://github.com/username" value={(formData.social_links as any)?.github || ""} onChange={(e) => setFormData((p) => ({ ...p, social_links: { ...(p.social_links || {}), github: e.target.value } }))} />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label>Default Author</Label>
                <p className="text-sm text-muted-foreground">Used as default for new posts.</p>
              </div>
              <Switch checked={!!formData.is_default} onCheckedChange={(checked) => setFormData((p) => ({ ...p, is_default: checked }))} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Author" : "Create Author"}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All Authors</CardTitle>
          <CardDescription>Click edit to modify details or delete if unused by posts.</CardDescription>
        </CardHeader>
        <CardContent>
          {authors.length === 0 ? (
            <div className="text-sm text-muted-foreground">No authors yet. Create one above.</div>
          ) : (
            <div className="divide-y rounded-md border">
              {authors.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{a.name}</div>
                      {a.is_default && (
                        <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          <Star className="mr-1 h-3 w-3" /> Default
                        </span>
                      )}
                    </div>
                    {a.email && <div className="text-xs text-muted-foreground truncate">{a.email}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!a.is_default && (
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/authors/${a.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: a.name,
                                email: a.email,
                                bio: a.bio,
                                avatar_url: a.avatar_url,
                                website_url: a.website_url,
                                social_links: a.social_links || {},
                                is_default: true,
                              }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || "Failed to set default");
                            await fetch("/api/settings", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ settings: { default_author_id: a.id } }),
                            });
                            await Promise.all([fetchAuthors(), refreshSettings()]);
                            toast({ title: "Default author updated" });
                          } catch (err) {
                            console.error(err);
                            toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to set default", variant: "destructive" });
                          }
                        }}
                      >
                        <Star className="mr-2 h-4 w-4" /> Make Default
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => startEdit(a)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => confirmDelete(a)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteAuthorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        author={authorToDelete}
        onConfirm={handleDelete}
        isDeleting={deleting}
      />
    </div>
  );
}
