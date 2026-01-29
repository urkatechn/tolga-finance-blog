"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image_url: string | null;
    category_id: string | null;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
}

interface PostEditorProps {
    post?: Post | null;
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
}

export function PostEditor({ post, categories, isOpen, onClose }: PostEditorProps) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<string>("all");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
    const [featured, setFeatured] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setSlug(post.slug || "");
            setExcerpt(post.excerpt || "");
            setContent(post.content || "");
            setCategoryId(post.category_id || "all");
            setImageUrl(post.featured_image_url || "");
            setStatus(post.status || 'draft');
            setFeatured(post.featured || false);
        } else {
            setTitle("");
            setSlug("");
            setExcerpt("");
            setContent("");
            setCategoryId("all");
            setImageUrl("");
            setStatus('draft');
            setFeatured(false);
        }
    }, [post, isOpen]);

    // Simple slug generator
    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (!post) { // Only auto-generate slug for new posts
            setSlug(generateSlug(val));
        }
    };

    const handleSave = async () => {
        if (!title || !slug || !content) {
            toast.error("Please fill in required fields (Title, Slug, Content)");
            return;
        }

        setIsSaving(true);
        const payload = {
            title,
            slug,
            excerpt,
            content,
            category_id: categoryId === "all" ? null : categoryId,
            featured_image_url: imageUrl,
            status,
            featured
        };

        try {
            const url = post ? `/api/posts/${post.id}` : "/api/posts";
            const method = post ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save post");
            }

            toast.success(post ? "Post updated successfully" : "Post created successfully");
            router.refresh();
            onClose();
        } catch (error: any) {
            console.error("Error saving post:", error);
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-[32px] p-0">
                <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {post ? "Edit Post" : "Create New Post"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            {post ? "Modify existing article parameters." : "Provision a new strategic article for the blog."}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Post Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Reflections on Finance"
                                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Slug *</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(generateSlug(e.target.value))}
                                placeholder="reflections-on-finance"
                                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Uncategorized</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Featured Image URL</Label>
                            <Input
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A brief overview of this post..."
                            className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl min-h-[80px]"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content (Markdown supported) *</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your strategic insights here..."
                            className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl min-h-[300px] font-mono text-sm"
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <Label htmlFor="status" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</Label>
                            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                                <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="featured"
                                checked={featured}
                                onCheckedChange={(val) => setFeatured(val as boolean)}
                                className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-600"
                            />
                            <Label htmlFor="featured" className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Mark as Featured</Label>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 sm:justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={isSaving} className="rounded-xl font-bold">
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl px-8 h-12 font-bold shadow-xl transition-all active:scale-95"
                    >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {post ? "Sync Changes" : "Provision Post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
