import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate, estimateReadTime } from "@/lib/api/supabase-posts";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface RelatedPostsProps {
  posts: PostWithCategory[];
  currentPostId: string;
}

export default function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Continue Reading
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore more insights and strategies to enhance your financial knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((post) => {
              const readTime = estimateReadTime(post.content);
              
              return (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden">
                  <CardHeader className="flex-1 pb-2">
                    <div className="flex justify-between items-start mb-3">
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {readTime} min
                      </div>
                    </div>

                    <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.title}
                      </Link>
                    </CardTitle>

                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt || post.content.substring(0, 160) + '...'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{post.published_at ? formatDate(post.published_at) : 'Draft'}</span>
                    </div>

                    <Button variant="ghost" size="sm" asChild className="w-full justify-between p-0 h-auto">
                      <Link href={`/blog/${post.slug}`} className="flex items-center justify-between w-full py-2">
                        <span>Read Article</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">
                View All Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
