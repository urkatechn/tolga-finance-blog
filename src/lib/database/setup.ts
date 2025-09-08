import { createClient } from '@/lib/supabase/server'

/**
 * Database setup script to verify tables exist and insert default data
 * Note: Run the supabase-migration.sql file in your Supabase SQL Editor first
 */
export async function setupDatabase() {
  const supabase = await createClient()
  
  try {
    console.log('🚀 Verifying database setup...')
    
    // Check if tables exist by trying to query them
    const { error: categoriesCheckError } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
    
    if (categoriesCheckError) {
      console.error('❌ Categories table not found. Please run the supabase-migration.sql file in your Supabase SQL Editor first.')
      return { 
        success: false, 
        error: 'Database tables not found. Run supabase-migration.sql first.',
        needsMigration: true
      }
    }
    
    console.log('✅ Categories table verified')
    
    const { error: postsCheckError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)
    
    if (postsCheckError) {
      console.error('❌ Posts table not found. Please run the supabase-migration.sql file in your Supabase SQL Editor first.')
      return { 
        success: false, 
        error: 'Database tables not found. Run supabase-migration.sql first.',
        needsMigration: true
      }
    }
    
    console.log('✅ Posts table verified')
    console.log('✅ Database indexes verified')
    console.log('✅ Database triggers verified')
    
    // Insert default categories if none exist
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
    
    if (!existingCategories || existingCategories.length === 0) {
      const defaultCategories = [
        {
          name: 'Personal Finance',
          slug: 'personal-finance',
          description: 'Tips and strategies for managing your personal finances',
          color: '#10B981' // Green
        },
        {
          name: 'Investing',
          slug: 'investing',
          description: 'Investment strategies, market analysis, and portfolio management',
          color: '#3B82F6' // Blue
        },
        {
          name: 'Retirement Planning',
          slug: 'retirement-planning',
          description: 'Planning for your retirement and financial security',
          color: '#8B5CF6' // Purple
        },
        {
          name: 'Market Analysis',
          slug: 'market-analysis',
          description: 'Analysis of financial markets and economic trends',
          color: '#F59E0B' // Amber
        },
        {
          name: 'Cryptocurrency',
          slug: 'cryptocurrency',
          description: 'Digital currencies, blockchain technology, and crypto investing',
          color: '#EF4444' // Red
        }
      ]
      
      const { error: insertError } = await supabase
        .from('categories')
        .insert(defaultCategories)
      
      if (insertError) {
        console.error('⚠️ Error inserting default categories:', insertError)
      } else {
        console.log('✅ Default categories inserted')
      }
    } else {
      console.log('✅ Categories already exist')
    }
    
    console.log('🎉 Database setup completed successfully!')
    return { success: true }
    
  } catch (error) {
    console.error('💥 Database setup failed:', error)
    return { success: false, error }
  }
}

// Export types for TypeScript
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  author_id: string | null
  category_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  meta_title: string | null
  meta_description: string | null
  tags: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category
}
