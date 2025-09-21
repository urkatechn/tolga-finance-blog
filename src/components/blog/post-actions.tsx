"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface PostActionsProps {
  postId: string; // kept for future use, not used now
  title: string;
}

export default function PostActions({ title }: PostActionsProps) {
  const handleShare = async () => {
    const { toast } = await import("sonner");
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        return;
      }
      // Fallback copy
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not share the link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleShare} aria-label="Share post">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
}
