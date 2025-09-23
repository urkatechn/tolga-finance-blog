import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, MessageCircle } from "lucide-react";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface PostCardProps {
  post: PostWithCategory;
  featured?: boolean;
  showFeaturedBadge?: boolean;
  commentCount?: number;
}

export default function PostCard({ post, featured = false, showFeaturedBadge = false, commentCount = 0 }: PostCardProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <article className="group py-6 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      {/* Mobile-first layout */}
      <div className="block sm:hidden">
        {/* Mobile Layout */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Finance Blog Team`} />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Finance Blog Team</span>
              <span>•</span>
              <time dateTime={post.published_at || ''}>
                {post.published_at ? formatDate(post.published_at) : 'Draft'}
              </time>
            </div>
          </div>
        </div>

        {/* Featured Image - Mobile */}
        {post.featured_image_url && (
          <div className="mb-3">
            <Link href={`/blog/${post.slug}`}>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>
        )}

        {/* Title and Content - Mobile */}
        <Link href={`/blog/${post.slug}`} className="group">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
            {post.category && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5"
                style={{ 
                  backgroundColor: `${post.category.color}15`,
                  color: post.category.color,
                }}
              >
                {post.category.name}
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt || post.content.substring(0, 120) + '...'}
          </p>
        </Link>

        {/* Meta Information - Mobile */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {/* Featured Star (for featured section) */}
            {featured && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-3 w-3 fill-current" />
              </div>
            )}

            {/* Featured Badge (for latest list when featured also shown) */}
            {showFeaturedBadge && post.featured && (
              <Badge className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-200">
                Featured
              </Badge>
            )}

            {/* Read Time */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readTime} min read</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{commentCount}</span>
            </div>
          </div>

          {/* Removed more options menu */}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex items-start gap-6">
          {/* Author Avatar */}
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Finance Blog Team`} />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author and Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">Finance Blog Team</span>
              <span>•</span>
              <time dateTime={post.published_at || ''}>
                {post.published_at ? formatDate(post.published_at) : 'Draft'}
              </time>
            </div>

            {/* Title and Excerpt */}
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${post.slug}`} className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.category && (
                      <Badge 
                        variant="secondary" 
                        className="text-[10px] px-2 py-0.5"
                        style={{ 
                          backgroundColor: `${post.category.color}15`,
                          color: post.category.color,
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt || post.content.substring(0, 120) + '...'}
                  </p>
                </Link>

                {/* Meta Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {/* Featured Star (for featured section) */}
                    {featured && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}

                    {/* Featured Badge (for latest list when featured also shown) */}
                    {showFeaturedBadge && post.featured && (
                      <Badge className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-200">
                        Featured
                      </Badge>
                    )}

                    {/* Read Time */}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{readTime} min read</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{commentCount}</span>
                    </div>
                  </div>

                  {/* Removed more options menu */}
                </div>
              </div>

              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="flex-shrink-0">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        width={128}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
