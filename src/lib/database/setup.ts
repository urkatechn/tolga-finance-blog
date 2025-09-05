import { createClient } from '@/lib/supabase/server'

/**
 * Database setup script to create tables if they don't exist
 * Run this once to initialize your database schema
 */
export async function setupDatabase() {
  const supabase = await createClient()
  
  try {
    console.log('🚀 Setting up database tables...')
    
    // Create categories table
    const categoriesTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3B82F6', -- Default blue color
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: categoriesTableQuery
    })
    
    if (categoriesError) {
      console.error('❌ Error creating categories table:', categoriesError)
    } else {
      console.log('✅ Categories table created/verified')
    }
    
    // Create posts table
    const postsTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image_url TEXT,
        author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured BOOLEAN DEFAULT FALSE,
        meta_title VARCHAR(255),
        meta_description TEXT,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: postsTableQuery
    })
    
    if (postsError) {
      console.error('❌ Error creating posts table:', postsError)
    } else {
      console.log('✅ Posts table created/verified')
    }
    
    // Create indexes for better performance
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);',
      'CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);',
      'CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);',
      'CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);',
      'CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = true;',
      'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);'
    ]
    
    for (const indexQuery of indexQueries) {
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql: indexQuery
      })
      
      if (indexError && !indexError.message.includes('already exists')) {
        console.error('⚠️ Error creating index:', indexError)
      }
    }
    
    console.log('✅ Database indexes created/verified')
    
    // Create updated_at trigger function
    const triggerFunctionQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `
    
    const { error: triggerFunctionError } = await supabase.rpc('exec_sql', {
      sql: triggerFunctionQuery
    })
    
    if (triggerFunctionError) {
      console.error('⚠️ Error creating trigger function:', triggerFunctionError)
    }
    
    // Create triggers for updated_at columns
    const triggerQueries = [
      `
      DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
      CREATE TRIGGER update_categories_updated_at
        BEFORE UPDATE ON categories
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `,
      `
      DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
      CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON posts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `
    ]
    
    for (const triggerQuery of triggerQueries) {
      const { error: triggerError } = await supabase.rpc('exec_sql', {
        sql: triggerQuery
      })
      
      if (triggerError) {
        console.error('⚠️ Error creating trigger:', triggerError)
      }
    }
    
    console.log('✅ Database triggers created/verified')
    
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
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category
}
