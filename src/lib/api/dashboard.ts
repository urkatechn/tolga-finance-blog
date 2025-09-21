import { createClient } from '@/lib/supabase/server';
import { Post } from './posts';

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  totalCategories: number;
  recentPostActivity: PostActivity[];
  topCategories: CategoryStat[];
  recentSubscribers: number;
}

export interface CategoryStat {
  name: string;
  postCount: number;
  color: string;
}

export interface PostActivity {
  id: string;
  title: string;
  action: 'published' | 'updated' | 'commented';
  date: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface PostViewsData {
  date: string;
  views: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();
    
    // Get posts data
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, status, created_at, updated_at, published_at, category_id, author_id')
      .neq('status', 'deleted');
    
    if (postsError) {
      console.error('Error fetching posts:', postsError);
    }
    
    // Get comments count
    const { count: totalComments, error: commentsError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }
    
    // Get subscribers count
    const { count: totalSubscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_subscribed', true);
    
    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
    }
    
    // Get categories with post counts
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        color,
        posts!inner(id)
      `);
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }
    
    // Get recent subscribers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentSubscribers, error: recentSubsError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_subscribed', true)
      .gte('subscription_date_time', thirtyDaysAgo.toISOString());
    
    if (recentSubsError) {
      console.error('Error fetching recent subscribers:', recentSubsError);
    }
    
    // Get recent post activity with author names
    const { data: recentActivity, error: activityError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        updated_at,
        published_at,
        authors(name, avatar_url)
      `)
      .order('updated_at', { ascending: false })
      .limit(5);
    
    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
    }
    
    // Calculate stats
    const totalPosts = posts?.length || 0;
    const publishedPosts = posts?.filter(post => post.status === 'published').length || 0;
    const draftPosts = posts?.filter(post => post.status === 'draft').length || 0;
    const totalCategories = categoriesData?.length || 0;
    
    // Process top categories
    const topCategories: CategoryStat[] = (categoriesData || [])
      .map(category => ({
        name: category.name,
        postCount: category.posts?.length || 0,
        color: category.color || '#3B82F6'
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
    
    // Process recent activity
    const recentPostActivity: PostActivity[] = (recentActivity || [])
      .map(post => {
        let action: 'published' | 'updated' | 'commented' = 'updated';
        let actionDate = post.updated_at;
        
        // Determine action type based on dates
        if (post.status === 'published' && post.published_at) {
          const publishedTime = new Date(post.published_at).getTime();
          const updatedTime = new Date(post.updated_at).getTime();
          const createdTime = new Date(post.created_at).getTime();
          
          // If published within last 7 days and close to created date
          if (Math.abs(publishedTime - createdTime) < 24 * 60 * 60 * 1000) {
            action = 'published';
            actionDate = post.published_at;
          }
        }
        
        return {
          id: post.id,
          title: post.title,
          action,
          date: actionDate,
          user: {
            id: 'author-id',
            name: post.authors?.name || 'Unknown Author',
            avatar: post.authors?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authors?.name || 'default'}`
          }
        };
      });
    
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: 0, // We don't have analytics yet, keeping as 0 for now
      totalComments: totalComments || 0,
      totalSubscribers: totalSubscribers || 0,
      totalCategories,
      recentSubscribers: recentSubscribers || 0,
      topCategories,
      recentPostActivity,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      totalComments: 0,
      totalSubscribers: 0,
      totalCategories: 0,
      recentSubscribers: 0,
      topCategories: [],
      recentPostActivity: [],
    };
  }
}

export async function getPostViewsData(): Promise<PostViewsData[]> {
  // In a real app, this would fetch analytics data from Firebase Analytics or a custom analytics solution
  // For now, we'll return mock data for the last 30 days
  const data: PostViewsData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic pattern with weekends having more views
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseViews = isWeekend ? 500 : 350;
    const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.round(baseViews * randomFactor),
    });
  }
  
  return data;
}
