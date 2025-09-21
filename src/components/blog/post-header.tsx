import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import PostActions from "@/components/blog/post-actions";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface PostHeaderProps {
  post: PostWithCategory;
}

export default function PostHeader({ post }: PostHeaderProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <div className="relative">
      {/* Header Content */}
      <section className={`${post.featured_image_url ? 'py-12' : 'py-16'} relative`}>
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
                {/* Actions merged into meta row */}
                <div className="ml-auto">
                  <PostActions postId={post.id} title={post.title} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Featured Image (now after meta info) */}
      {post.featured_image_url && (
        <div className="container mx-auto px-4 mt-6">
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden max-w-4xl mx-auto rounded-xl">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}

interface PostHeaderWithInteractionsProps {
  post: PostWithCategory;
  children?: React.ReactNode;
}

export function PostHeaderWithInteractions({ post, children }: PostHeaderWithInteractionsProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <div className="relative">
      {/* Header Content */}
      <section className={`${post.featured_image_url ? 'py-12' : 'py-16'} relative`}>
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
                {/* Actions merged into meta row */}
                <div className="ml-auto">
                  <PostActions postId={post.id} title={post.title} />
                </div>
              </div>

              {/* Post Interactions */}
              {children && (
                <div className="pt-4">
                  {children}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Featured Image (now after meta info) */}
      {post.featured_image_url && (
        <div className="container mx-auto px-4 mt-6">
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden max-w-4xl mx-auto rounded-xl">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}
