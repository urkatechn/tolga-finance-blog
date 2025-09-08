import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from "lucide-react";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface PostHeaderProps {
  post: PostWithCategory;
}

export default function PostHeader({ post }: PostHeaderProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <div className="relative">
      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button Overlay */}
          <div className="absolute top-6 left-6">
            <Button variant="secondary" asChild size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header Content */}
      <section className={`${post.featured_image_url ? 'py-12' : 'py-16'} relative`}>
        {!post.featured_image_url && (
          <div className="absolute top-6 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Button variant="ghost" asChild className="mb-6">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Category and Featured Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                {post.category && (
                  <Badge 
                    variant="secondary" 
                    className="text-sm px-3 py-1"
                    style={{ 
                      backgroundColor: `${post.category.color}20`,
                      color: post.category.color,
                      borderColor: `${post.category.color}40`
                    }}
                  >
                    {post.category.name}
                  </Badge>
                )}
                {post.featured && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    Featured Article
                  </Badge>
                )}
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.split(',').map((tag: string, index: number) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                    >
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Finance Blog Team</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.published_at ? formatDate(post.published_at) : 'Draft'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>

                {post.updated_at !== post.created_at && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Updated {formatDate(post.updated_at)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
