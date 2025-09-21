import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { getCachedPosts, getCachedCategories, getCachedRecentPosts } from "@/lib/cache";
import PostCard from "@/components/blog/post-card";
import BlogSidebar from "@/components/blog/blog-sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 1800; // Revalidate every 30 minutes

interface BlogPageProps {
  searchParams: Promise<{ 
    category?: string; 
    search?: string; 
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;
  // Fetch real data from Supabase with caching
  const settings = await getServerSettings();
  const [posts, categories, recentPosts] = await Promise.all([
    getCachedPosts({
      category: sp.category,
      search: sp.search,
      limit: 12, // Show 12 posts per page
    }),
    getCachedCategories(),
    getCachedRecentPosts(5), // Get 5 recent posts for sidebar
  ]);

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No articles found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
{sp.search || sp.category 
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
{featuredPosts.length > 0 && !sp.search && !sp.category && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
                      <div className="h-px bg-gradient-to-r from-blue-600 to-transparent flex-1" />
                    </div>
                    <div className="space-y-0">
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
{sp.category && sp.category !== "all" 
                          ? `${categories.find(c => c.slug === sp.category)?.name || sp.category} Articles`
                          : sp.search 
                            ? `Search Results for \"${sp.search}\"`
                            : "Latest Articles"
                        }
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({posts.length} {posts.length === 1 ? 'article' : 'articles'})
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-0">
{(featuredPosts.length > 0 && !sp.search && !sp.category 
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
              
              {/* Sidebar */}
              <div className="lg:col-span-4 mt-12 lg:mt-0">
                <div className="sticky top-8">
                  <BlogSidebar 
                    recentPosts={recentPosts} 
                    categories={categories.map(cat => ({
                      ...cat,
                      post_count: posts.filter(p => p.category?.id === cat.id).length
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ServerFooter settings={settings} />
    </div>
  );
}
