"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

interface Post {
    id: string;
    title: string;
}

interface AdminBlogBarProps {
    posts: Post[];
}

export function AdminBlogBar({ posts }: AdminBlogBarProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
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
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mb-12 p-4 rounded-2xl bg-slate-900/5 dark:bg-slate-100/5 backdrop-blur-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 shadow-xl">
            <div className="flex items-center gap-2 mr-auto">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Admin Control</span>
            </div>

            <Button asChild span-size="sm" className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg">
                <Link href="/admin/posts/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Post
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] max-h-[300px] overflow-y-auto">
                    {posts.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">No posts found</div>
                    ) : (
                        posts.map((post) => (
                            <DropdownMenuItem key={post.id} asChild>
                                <Link href={`/admin/posts/${post.id}`} className="truncate">
                                    {post.title}
                                </Link>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Post
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] max-h-[300px] overflow-y-auto">
                    {posts.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">No posts found</div>
                    ) : (
                        posts.map((post) => (
                            <DropdownMenuItem
                                key={post.id}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                                onClick={() => setPostToDelete(post)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                                <span className="truncate">{post.title}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete "{postToDelete?.title}" and move it to the archive. This action can be undone from the main Admin Portal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete Post
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
