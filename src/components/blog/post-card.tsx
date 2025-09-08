import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface PostCardProps {
  post: PostWithCategory;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const readTime = estimateReadTime(post.content);

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden ${
      featured ? 'border-2 border-blue-200 dark:border-blue-800' : ''
    }`}>
      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden relative">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="flex-1 pb-2">
        {/* Category and Featured Badge */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            {post.category && (
              <Badge 
                variant="secondary" 
                className="text-xs"
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
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </div>
        </div>

        {/* Title */}
        <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          <Link href={`/blog/${post.slug}`} className="block">
            {post.title}
          </Link>
        </CardTitle>

        {/* Excerpt */}
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {post.excerpt || post.content.substring(0, 160) + '...'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.published_at ? formatDate(post.published_at) : 'Draft'}
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button variant="ghost" size="sm" asChild className="w-full justify-between p-0 h-auto">
          <Link href={`/blog/${post.slug}`} className="flex items-center justify-between w-full py-2">
            <span>Read Article</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
