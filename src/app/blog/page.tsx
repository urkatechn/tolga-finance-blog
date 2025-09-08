import Header from "@/components/layout/header";
import BlogHeader from "@/components/blog/blog-header";
import SearchFilters from "@/components/blog/search-filters";
import PostCard from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { getPosts, getCategories } from "@/lib/api/supabase-posts";
import Link from "next/link";

export const revalidate = 1800; // Revalidate every 30 minutes

interface BlogPageProps {
  searchParams: { 
    category?: string; 
    search?: string; 
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Fetch real data from Supabase
  const [posts, categories] = await Promise.all([
    getPosts({
      category: searchParams.category,
      search: searchParams.search,
      limit: 12, // Show 12 posts per page
    }),
    getCategories(),
  ]);

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHeader totalPosts={posts.length} totalCategories={categories.length} />
      <SearchFilters categories={categories} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No articles found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchParams.search || searchParams.category 
                    ? "Try adjusting your search or filter criteria to find more articles."
                    : "No articles have been published yet. Check back soon for new content!"
                  }
                </p>
                <Button asChild>
                  <Link href="/blog">View All Articles</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Posts Section */}
                {featuredPosts.length > 0 && !searchParams.search && !searchParams.category && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
                      <div className="h-px bg-gradient-to-r from-blue-600 to-transparent flex-1" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {featuredPosts.slice(0, 3).map((post) => (
                        <PostCard key={post.id} post={post} featured={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Posts Section */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {searchParams.category && searchParams.category !== "all" 
                          ? `${categories.find(c => c.slug === searchParams.category)?.name || searchParams.category} Articles`
                          : searchParams.search 
                            ? `Search Results for "${searchParams.search}"`
                            : "Latest Articles"
                        }
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({posts.length} {posts.length === 1 ? 'article' : 'articles'})
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(featuredPosts.length > 0 && !searchParams.search && !searchParams.category 
                      ? regularPosts 
                      : posts
                    ).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
