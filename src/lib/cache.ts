import { unstable_cache } from 'next/cache';
import { getPosts, getPostBySlug, getCategories } from '@/lib/api/supabase-posts';
import type { PostFilters } from '@/lib/api/supabase-posts';

// Cache posts with 30 minutes TTL
export const getCachedPosts = unstable_cache(
  async (filters: PostFilters = {}) => {
    return getPosts(filters);
  },
  ['posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['posts'],
  }
);

// Cache individual post with 1 hour TTL
export const getCachedPostBySlug = unstable_cache(
  async (slug: string) => {
    return getPostBySlug(slug);
  },
  ['post-by-slug'],
  {
    revalidate: 3600, // 1 hour
    tags: ['posts', 'post'],
  }
);

// Cache categories with 1 day TTL (they change less frequently)
export const getCachedCategories = unstable_cache(
  async () => {
    return getCategories();
  },
  ['categories'],
  {
    revalidate: 86400, // 24 hours
    tags: ['categories'],
  }
);

// Cache featured posts with 30 minutes TTL
export const getCachedFeaturedPosts = unstable_cache(
  async (limit: number = 3) => {
    return getPosts({ limit, featured: true, status: 'published' });
  },
  ['featured-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['posts', 'featured-posts'],
  }
);

// Cache recent posts with 30 minutes TTL
export const getCachedRecentPosts = unstable_cache(
  async (limit: number = 5) => {
    return getPosts({ limit, status: 'published' });
  },
  ['recent-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['posts', 'recent-posts'],
  }
);
