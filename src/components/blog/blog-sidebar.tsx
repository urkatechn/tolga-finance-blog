"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users, Mail, Tag, Clock, ArrowRight } from "lucide-react";
import type { PostWithCategory } from "@/lib/api/supabase-posts";

interface BlogSidebarProps {
  recentPosts?: PostWithCategory[];
  categories?: Array<{ id: string; name: string; slug: string; color: string; post_count?: number }>;
}

export default function BlogSidebar({ recentPosts = [], categories = [] }: BlogSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Stay Updated</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get the latest financial insights delivered to your inbox weekly.
          </p>
          <div className="space-y-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="bg-white dark:bg-gray-800"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No spam. Unsubscribe anytime.
          </p>
        </CardContent>
      </Card>

      {/* Trending Posts */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Trending Posts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.slice(0, 4).map((post, index) => (
              <div key={post.id} className="flex gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/blog/${post.slug}`}>
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>2 min read</span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <span style={{ color: post.category.color }}>
                          {post.category.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" asChild className="w-full justify-between mt-4">
              <Link href="/blog">
                <span>View All Posts</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <Link key={category.id} href={`/blog?category=${category.slug}`}>
                  <Badge 
                    variant="secondary" 
                    className="hover:scale-105 transition-transform cursor-pointer"
                    style={{ 
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                      borderColor: `${category.color}30`
                    }}
                  >
                    {category.name}
                    {category.post_count && (
                      <span className="ml-1 text-xs opacity-70">
                        ({category.post_count})
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
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">About Finance Blog</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Finance Blog Team" />
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">Finance Blog Team</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Financial Experts
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            We&apos;re passionate about making finance accessible to everyone. Our team of experts shares insights, tips, and strategies to help you make informed financial decisions.
          </p>
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href="/about">
              Learn More About Us
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">10K+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Readers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Updated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
