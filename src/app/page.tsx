// @ts-nocheck
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { ClientHeroSection } from "@/components/hero/hero-motion";
import { ClientFeaturesSection } from "@/components/landing/features-motion";
import { ClientFeaturedPosts } from "@/components/landing/featured-posts-motion";
import { ClientNewsletterSection } from "@/components/landing/newsletter-motion";
import { createClient } from "@/lib/supabase/server";
import { getServerSettings } from "@/lib/server-settings";

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedPosts() {
  const supabase = await createClient();
  // Fetch only featured, published posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }

  if (!posts) return [];

  return posts.map((post: { id: string; title: string; excerpt?: string; content?: string; created_at: string; published_at?: string | null; slug: string; category_id?: string | null }) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
    category: 'general',
    readTime: 5,
    publishedAt: post.published_at || post.created_at,
    slug: post.slug
  }));
}

export default async function Home() {
  // Fetch featured posts from database
  const featuredPosts = await getFeaturedPosts();

  // Fetch total article count
  const supabase = await createClient();
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Load settings server-side to prevent hydration mismatch
  const settings = await getServerSettings();

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-50">
          <ServerHeader settings={settings} transparent={true} />
        </div>
        <ClientHeroSection settings={settings} articleCount={count || 0} />
      </div>

      {/* What You'll Find Here - Animated */}
      <ClientFeaturesSection settings={settings} />

      {/* Featured Posts Section - Animated */}
      {featuredPosts.length > 0 && (
        <ClientFeaturedPosts posts={featuredPosts as any} />
      )}

      {/* Newsletter Subscription Section - Animated */}
      <ClientNewsletterSection settings={settings} />

      <ServerFooter settings={settings} />
    </div>
  );
}
