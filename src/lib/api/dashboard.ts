import { firestore } from './firebase';
import { Post } from './posts';

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  recentPostActivity: PostActivity[];
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
    // Get posts
    const postsSnapshot = await firestore.collection('posts').where('status', '!=', 'deleted').get();
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    // Calculate stats
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.status === 'published').length;
    const draftPosts = posts.filter(post => post.status === 'draft').length;
    
    // In a real app, these would be fetched from analytics or comments collection
    const totalViews = 12500;
    const totalComments = 348;
    
    // Generate mock recent activity
    const recentPostActivity: PostActivity[] = [
      {
        id: 'post-1',
        title: 'Understanding Market Volatility',
        action: 'published',
        date: '2025-08-15T10:30:00Z',
        user: {
          id: 'admin-user-123',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
      },
      {
        id: 'post-2',
        title: 'Retirement Planning Basics',
        action: 'updated',
        date: '2025-08-12T09:15:00Z',
        user: {
          id: 'admin-user-123',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
      },
      {
        id: 'post-3',
        title: 'Cryptocurrency Investment Guide',
        action: 'commented',
        date: '2025-08-11T14:22:00Z',
        user: {
          id: 'author-user-456',
          name: 'Author User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author',
        },
      },
      {
        id: 'post-5',
        title: 'Emergency Fund Essentials',
        action: 'commented',
        date: '2025-08-05T11:45:00Z',
        user: {
          id: 'admin-user-123',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
      },
      {
        id: 'post-4',
        title: 'Tax Optimization Strategies',
        action: 'updated',
        date: '2025-08-01T13:20:00Z',
        user: {
          id: 'admin-user-123',
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
      },
    ];
    
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalComments,
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
