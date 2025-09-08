import { createClient } from '@/lib/supabase/server'
import type { Post, Category } from '@/lib/database/setup'

export interface PostWithCategory extends Omit<Post, 'category'> {
  category: Category | null
}

export interface PostFilters {
  category?: string
  search?: string
  status?: 'published' | 'draft' | 'archived'
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getPosts(filters: PostFilters = {}): Promise<PostWithCategory[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `)
    .order('published_at', { ascending: false })

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    // Default to published posts for public view
    query = query.eq('status', 'published')
  }

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category.slug', filters.category)
  }

  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }

  return data
}

export async function getFeaturedPosts(limit = 3): Promise<PostWithCategory[]> {
  return getPosts({ featured: true, limit })
}

export async function getRecentPosts(limit = 5): Promise<PostWithCategory[]> {
  return getPosts({ limit })
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getPostsByCategory(categorySlug: string, limit?: number): Promise<PostWithCategory[]> {
  return getPosts({ category: categorySlug, limit })
}

// Helper function to estimate read time based on content length
export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return Math.max(1, minutes)
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to get post excerpt
export function getPostExcerpt(content: string, maxLength = 160): string {
  // Remove markdown and HTML tags
  const plainText = content.replace(/[#*`_~\[\]()]/g, '').replace(/<[^>]*>/g, '')
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.substring(0, maxLength).trim() + '...'
}
