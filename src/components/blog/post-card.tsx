import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, MessageCircle } from "lucide-react";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";
import type { SiteSettings } from "@/contexts/settings-context";

interface PostCardProps {
  post: PostWithCategory;
  featured?: boolean;
  showFeaturedBadge?: boolean;
  commentCount?: number;
  settings?: SiteSettings;
}

export default function PostCard({ post, featured = false, showFeaturedBadge = false, commentCount = 0, settings }: PostCardProps) {
  const readTime = estimateReadTime(post.content);

  // Visual settings with defaults
  const showExcerpt = settings?.blog_show_excerpt ?? true;
  const showReadTime = settings?.blog_show_read_time ?? true;
  const showCommentCount = settings?.blog_show_comment_count ?? true;

  // Animation effects are always enabled (not configurable)
  const imageHoverClass = "group-hover:scale-105 transition-transform duration-300";
  const cardHoverClass = "group-hover:text-blue-600 transition-colors";

  return (
    <article className="group relative py-4 px-4 sm:px-6 transition-all">
      <div className="flex items-start gap-4">
        {/* Forum Style Vertical Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5"
          style={{ backgroundColor: post.category?.color || '#cbd5e1' }}
        />

        {/* Post Image (Compact Thumbnail) */}
        {post.featured_image_url && (
          <div className="hidden sm:block flex-shrink-0 mt-1">
            <Link href={`/blog/${post.slug}`}>
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">
                {post.title}
              </h2>
            </Link>
            {post.featured && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
            {showFeaturedBadge && post.featured && (
              <Badge className="text-[10px] uppercase font-black px-2 py-0 bg-yellow-400 text-yellow-900 border-none">
                Featured
              </Badge>
            )}
          </div>

          {showExcerpt && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2 font-medium opacity-80 decoration-slate-200 dark:decoration-slate-800 decoration-1 underline-offset-2">
              {post.excerpt || post.content.substring(0, 100) + '...'}
            </p>
          )}

          {/* Meta Line - Professional Forum look */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-4 w-4 border border-slate-200 dark:border-slate-800">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Tolga`} />
                  <AvatarFallback className="text-[6px]">TT</AvatarFallback>
                </Avatar>
                <span className="text-slate-600 dark:text-slate-300">ADMIN</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.published_at ? formatDate(post.published_at) : 'Draft'}</span>
              </div>
              {showReadTime && (
                <div className="hidden sm:flex items-center gap-1">
                  <span>{readTime} MIN READ</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {showCommentCount && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold">
                  <MessageCircle className="h-3 w-3" />
                  <span>{commentCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
