import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { getCachedPosts, getCachedCategories, getCachedRecentPosts } from "@/lib/cache";
import { createClient } from "@/lib/supabase/server";
import { BlogMotion } from "@/components/pages/blog-motion";

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
  const page = Math.max(1, Number(sp.page || 1));
  const limit = 12;
  const fetchLimit = limit + 1; // fetch one extra to detect next page
  // Fetch real data from Supabase with caching
  const settings = await getServerSettings();
  const [posts, categories, recentPosts] = await Promise.all([
    getCachedPosts({
      category: sp.category,
      search: sp.search,
      limit: fetchLimit,
      offset: (page - 1) * limit,
    }),
    getCachedCategories(),
    getCachedRecentPosts(5), // Get 5 recent posts for sidebar
  ]);

  // Pagination
  const hasNext = posts.length > limit;
  const visiblePosts = hasNext ? posts.slice(0, limit) : posts;

  // Fetch comment counts for listed posts (approved, not spam)
  const postIds = visiblePosts.map(p => p.id);
  const supabase = await createClient();
  const commentsCountMap: Record<string, number> = {};
  if (postIds.length > 0) {
    const { data: comments } = await supabase
      .from('comments')
      .select('id, post_id, is_approved, is_spam')
      .in('post_id', postIds)
      .eq('is_approved', true)
      .eq('is_spam', false);
    (comments || []).forEach((c: any) => {
      commentsCountMap[c.post_id] = (commentsCountMap[c.post_id] || 0) + 1;
    });
  }

  // These variables are now handled inside the BlogMotion component

  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      <BlogMotion 
        posts={visiblePosts}
        categories={categories}
        recentPosts={recentPosts}
        searchParams={sp}
        commentsCountMap={commentsCountMap}
        hasNext={hasNext}
        page={page}
      />
      <ServerFooter settings={settings} />
    </div>
  );
}
