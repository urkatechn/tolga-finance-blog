"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  slug: string;
}

interface Props {
  posts: FeaturedPost[];
}

const easing = [0.16, 1, 0.3, 1] as const;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } } };

export function ClientFeaturedPosts({ posts }: Props) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="flex justify-between items-center mb-12" variants={fadeUp}>
            <h2 className="text-3xl font-bold">Featured Articles</h2>
            <Button variant="outline" asChild>
              <Link href="/blog">View All Articles</Link>
            </Button>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.readTime} min read</span>
                    </div>
                    <CardTitle className="hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

