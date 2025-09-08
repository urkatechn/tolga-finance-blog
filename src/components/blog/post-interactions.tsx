"use client";

import { MessageCircle, Share2 } from "lucide-react";

interface PostInteractionsProps {
  initialComments?: number;
}

export default function PostInteractions({ 
  initialComments = 0 
}: PostInteractionsProps) {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-between py-6 border-t border-b border-border/40 my-8">
      <div className="flex items-center space-x-6">
        <button
          onClick={scrollToComments}
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{initialComments}</span>
        </button>
      </div>

      <button
        onClick={handleShare}
        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
