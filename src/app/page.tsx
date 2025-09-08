import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, PieChart } from "lucide-react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/hero/hero-section";
import NewsletterSignup from "@/components/blog/newsletter-signup";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Mock featured posts - in real app, fetch from API
  const featuredPosts = [
    {
      id: "post-1",
      title: "Understanding Market Volatility",
      excerpt: "Learn how market volatility works and strategies to navigate turbulent times.",
      category: "investing",
      readTime: 5,
      publishedAt: "2025-08-15",
      slug: "understanding-market-volatility"
    },
    {
      id: "post-2", 
      title: "Building Your Emergency Fund",
      excerpt: "A comprehensive guide to building and maintaining an emergency fund for financial security.",
      category: "saving",
      readTime: 7,
      publishedAt: "2025-07-28",
      slug: "building-emergency-fund"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You&apos;ll Learn</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Investment Strategies</CardTitle>
                  <CardDescription>
                    Learn proven investment strategies and market analysis techniques
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Personal Finance</CardTitle>
                  <CardDescription>
                    Master budgeting, saving, and debt management for financial freedom
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <PieChart className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>
                    Build and manage diversified portfolios for long-term growth
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Articles</h2>
              <Button variant="outline" asChild>
                <Link href="/blog">View All Articles</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section id="newsletter" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Ahead of the Markets
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of smart investors who get our weekly insights delivered straight to their inbox. 
                No spam, just actionable financial advice.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
