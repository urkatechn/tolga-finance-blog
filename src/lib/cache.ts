import { unstable_cache } from 'next/cache';
import { getPosts, getPostBySlug, getCategories } from '@/lib/api/supabase-posts';
import type { PostFilters } from '@/lib/api/supabase-posts';

// Cache posts with 30 minutes TTL (per-filter cache)
export const getCachedPosts = async (filters: PostFilters = {}) =>
  unstable_cache(
    async () => {
      return getPosts(filters);
    },
    ['posts', JSON.stringify({
      category: filters.category || 'all',
      search: filters.search || '',
      status: filters.status || 'published',
      featured: filters.featured ?? null,
      limit: filters.limit || null,
      offset: filters.offset || 0,
    })],
    {
      revalidate: 1800, // 30 minutes
      tags: ['posts'],
    }
  )();

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

// Cache featured posts with 30 minutes TTL (per-limit cache)
export const getCachedFeaturedPosts = async (limit: number = 3) =>
  unstable_cache(
    async () => getPosts({ limit, featured: true, status: 'published' }),
    ['featured-posts', String(limit)],
    {
      revalidate: 1800, // 30 minutes
      tags: ['posts', 'featured-posts'],
    }
  )();

// Cache recent posts with 30 minutes TTL (per-limit cache)
export const getCachedRecentPosts = async (limit: number = 5) =>
  unstable_cache(
    async () => getPosts({ limit, status: 'published' }),
    ['recent-posts', String(limit)],
    {
      revalidate: 1800, // 30 minutes
      tags: ['posts', 'recent-posts'],
    }
  )();
