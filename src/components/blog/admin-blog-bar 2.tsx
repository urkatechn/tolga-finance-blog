"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostEditor } from "./post-editor";

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

interface AdminBlogBarProps {
    posts: Post[];
    categories: Category[];
}

export function AdminBlogBar({ posts, categories }: AdminBlogBarProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const router = useRouter();

    const handleDelete = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/posts/${postToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete post");

            toast.success("Post deleted successfully");
            router.refresh();
            setPostToDelete(null);
        } catch (error: any) {
            console.error("Error deleting post:", error);
            toast.error(error.message || "Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewPost = () => {
        setSelectedPost(null);
        setIsEditorOpen(true);
    };

    const handleEditPost = (post: Post) => {
        setSelectedPost(post);
        setIsEditorOpen(true);
    };

    return (
        <div className="mb-12 p-3 rounded-[24px] bg-slate-900/80 dark:bg-white/80 backdrop-blur-2xl border border-slate-700/50 dark:border-slate-200/50 flex flex-wrap items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-700/50 dark:border-slate-200/50">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-40" />
                </div>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Blog Management</span>
            </div>

            <Button
                onClick={handleNewPost}
                size="sm"
                className="bg-white/10 hover:bg-white/20 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 text-white dark:text-slate-900 border border-white/10 dark:border-slate-900/10 rounded-2xl px-6 h-10 font-bold transition-all hover:scale-105"
            >
                <Plus className="mr-2 h-4 w-4" />
                Provision Article
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 rounded-xl h-10 px-4">
                        <Pencil className="mr-2 h-4 w-4" />
                        Modify Pillar
                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-200 rounded-2xl shadow-3xl p-2">
                    {posts.length === 0 ? (
                        <div className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-widest">No articles found</div>
                    ) : (
                        posts.map((post) => (
                            <DropdownMenuItem
                                key={post.id}
                                onClick={() => handleEditPost(post)}
                                className="rounded-xl h-11 px-3 text-slate-300 dark:text-slate-700 focus:bg-white/10 dark:focus:bg-slate-100 cursor-pointer"
                            >
                                <span className="truncate font-medium">{post.title}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl h-10 px-4">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Decommission
                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-200 rounded-2xl shadow-3xl p-2">
                    {posts.length === 0 ? (
                        <div className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-widest">No articles found</div>
                    ) : (
                        posts.map((post) => (
                            <DropdownMenuItem
                                key={post.id}
                                className="rounded-xl h-11 px-3 text-red-400 focus:bg-red-400/10 cursor-pointer"
                                onClick={() => setPostToDelete(post)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate font-medium">{post.title}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <PostEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                post={selectedPost}
                categories={categories}
            />

            <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 rounded-[32px] p-8 shadow-3xl">
                    <AlertDialogHeader>
                        <div className="w-12 h-1 bg-red-500 mb-6" />
                        <AlertDialogTitle className="text-3xl font-black text-white tracking-tight">Confirm Decommissioning</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium pt-2">
                            This will permanently remove "<span className="text-white font-bold">{postToDelete?.title}</span>" from the strategic archives. This action is irreversible within this interface.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-10 gap-3">
                        <AlertDialogCancel className="bg-transparent border-slate-800 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl h-12">Abort</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-8 h-12 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 border-none"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Confirm Decommission
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
