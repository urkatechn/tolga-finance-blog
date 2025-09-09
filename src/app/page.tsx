import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, PieChart } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero/hero-section";
import NewsletterSignup from "@/components/blog/newsletter-signup";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedPosts() {
  const supabase = await createClient();
  
  // First, let's try a simple query to see what columns exist
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }

  // Return mock data for now if no posts exist
  if (!posts || posts.length === 0) {
    return [
      {
        id: "1",
        title: "Understanding Market Volatility",
        excerpt: "Learn how market volatility works and strategies to navigate turbulent times.",
        category: "investing",
        readTime: 5,
        publishedAt: "2025-08-15",
        slug: "understanding-market-volatility"
      },
      {
        id: "2", 
        title: "Building Your Emergency Fund",
        excerpt: "A comprehensive guide to building and maintaining an emergency fund for financial security.",
        category: "saving",
        readTime: 7,
        publishedAt: "2025-07-28",
        slug: "building-emergency-fund"
      }
    ];
  }

  return posts.map((post: { id: string; title: string; excerpt?: string; content?: string; created_at: string; slug: string }) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
    category: 'general',
    readTime: 5,
    publishedAt: post.created_at,
    slug: post.slug
  }));
}

export default async function Home() {
  // Fetch featured posts from database
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />

      {/* What You'll Find Here */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What You&apos;ll Find Here</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Real financial advice from someone who&apos;s made the mistakes so you don&apos;t have to
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                  <CardTitle className="text-xl mb-2">Honest Investing</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    No get-rich-quick schemes. Just real strategies for building wealth over time, 
                    including the mistakes I made along the way.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-600 mb-4" />
                  <CardTitle className="text-xl mb-2">Money That Works</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Practical budgeting, saving, and debt strategies that actually fit into real life. 
                    No perfect spreadsheets required.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <PieChart className="h-8 w-8 text-purple-600 mb-4" />
                  <CardTitle className="text-xl mb-2">Simple Portfolios</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Build diversified portfolios without the complexity. Learn what works 
                    and what doesn&apos;t from 12+ years of trial and error.
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
              {featuredPosts.map((post: { id: string; title: string; excerpt: string; category: string; readTime: number; publishedAt: string; slug: string }) => (
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
                Join the Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Get my latest thoughts on investing, money, and life delivered weekly. 
                No spam, no sales pitches - just honest insights from someone still figuring it out.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
