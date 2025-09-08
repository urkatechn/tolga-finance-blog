"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostInteractionsProps {
  postId: string;
  initialLikes?: number;
  initialComments?: number;
}

export default function PostInteractions({ 
  postId, 
  initialLikes = 0, 
  initialComments = 0 
}: PostInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if user has already liked this post (from localStorage)
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const { likes_count } = await response.json();
        setLikes(likes_count);
        setIsLiked(!isLiked);
        
        // Update localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (isLiked) {
          const updatedLikes = likedPosts.filter((id: string) => id !== postId);
          localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
        } else {
          likedPosts.push(postId);
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

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
          onClick={handleLike}
          className={`flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${
            isLiked ? 'text-red-500' : ''
          } ${isAnimating ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
          disabled={isAnimating}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 ${
              isLiked ? 'fill-red-500 text-red-500' : ''
            }`} 
          />
          <span>{likes}</span>
        </button>

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
