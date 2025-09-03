import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search } from "lucide-react";

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Mock posts data - in real app, fetch from API with filters
  const allPosts = [
    {
      id: "post-1",
      title: "Understanding Market Volatility",
      excerpt: "Learn how market volatility works and strategies to navigate turbulent times.",
      category: "investing",
      readTime: 5,
      publishedAt: "2025-08-15",
      slug: "understanding-market-volatility",
      author: "Admin User",
      featured: true
    },
    {
      id: "post-2", 
      title: "Building Your Emergency Fund",
      excerpt: "A comprehensive guide to building and maintaining an emergency fund for financial security.",
      category: "saving",
      readTime: 7,
      publishedAt: "2025-07-28",
      slug: "building-emergency-fund",
      author: "Admin User",
      featured: false
    },
    {
      id: "post-3",
      title: "Cryptocurrency Investment Basics",
      excerpt: "Everything you need to know before investing in cryptocurrencies.",
      category: "investing",
      readTime: 8,
      publishedAt: "2025-07-15",
      slug: "cryptocurrency-investment-basics",
      author: "Admin User",
      featured: false
    }
  ];

  // Filter posts based on search params
  let filteredPosts = allPosts;
  
  if (searchParams.category && searchParams.category !== "all") {
    filteredPosts = filteredPosts.filter(post => post.category === searchParams.category);
  }
  
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  const categories = ["all", "investing", "saving", "budgeting", "retirement"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Finance Blog</h1>
            <p className="text-xl opacity-90">
              Expert insights and practical advice for your financial journey
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <Select defaultValue={searchParams.category || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 w-full md:w-[300px]"
                  defaultValue={searchParams.search || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button asChild>
                  <Link href="/blog">View All Articles</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    {searchParams.category && searchParams.category !== "all" 
                      ? `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Articles`
                      : "All Articles"
                    } ({filteredPosts.length})
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                      <CardHeader className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={post.featured ? "default" : "secondary"}>
                            {post.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{post.readTime} min read</span>
                        </div>
                        <CardTitle className="hover:text-blue-600 transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            <div>{post.author}</div>
                            <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                          </div>
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
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
