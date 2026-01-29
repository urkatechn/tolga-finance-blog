"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users, Mail, Tag, Clock, ArrowRight, CheckCircle } from "lucide-react";
import type { PostWithCategory } from "@/lib/api/supabase-posts";
import type { SiteSettings } from "@/contexts/settings-context";

interface BlogSidebarProps {
  recentPosts?: PostWithCategory[];
  categories?: Array<{ id: string; name: string; slug: string; color: string; post_count?: number }>;
  settings?: SiteSettings;
}

export default function BlogSidebar({ recentPosts = [], categories = [], settings }: BlogSidebarProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Subscription failed');
      }
      setSubmitted(true);
      setEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Subscription failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending Posts */}
      {recentPosts.length > 0 && (settings?.sidebar_show_trending ?? true) && (
        <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {settings?.sidebar_trending_title || "Trending Posts"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentPosts.slice(0, settings?.sidebar_trending_limit || 5).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="text-xl font-black text-slate-200 dark:text-slate-800 group-hover:text-slate-300 dark:group-hover:text-slate-700 transition-colors leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>2 min read</span>
                      </div>
                      {post.category && (
                        <span className="font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800" style={{ color: post.category.color }}>
                          {post.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
          <div className="p-3 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" asChild className="w-full text-xs text-slate-500 hover:text-slate-900 justify-center">
              <Link href="/blog" className="flex items-center gap-2">
                <span>View All Posts</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (settings?.sidebar_show_categories ?? true) && (
        <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {settings?.sidebar_categories_title || "Categories"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, settings?.sidebar_categories_limit || 12).map((category) => (
                <Link key={category.id} href={`/blog?category=${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="hover:scale-105 transition-all cursor-pointer font-medium px-2.5 py-1"
                    style={{
                      backgroundColor: `${category.color}10`,
                      color: category.color,
                      borderColor: `${category.color}30`
                    }}
                  >
                    #{category.name}
                    {category.post_count && (
                      <span className="ml-1.5 opacity-60 text-[10px]">
                        {category.post_count}
                      </span>
                    )}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {(settings?.sidebar_show_about ?? true) && (
        <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Team
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-800">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Tolga`} />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 underline decoration-slate-200 dark:decoration-slate-800 decoration-2 underline-offset-4">
                  {settings?.sidebar_about_author_name || "Tolga Tanagardigil"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {settings?.sidebar_about_author_role || "Financial Consultant"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {settings?.sidebar_about_description || "Insightful financial analysis and market trends from a professional perspective."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
