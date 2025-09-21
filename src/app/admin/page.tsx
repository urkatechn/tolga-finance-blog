import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, TrendingUp, BarChart3, Users, Tag, Calendar, Plus } from "lucide-react";
import { getUser } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/lib/api/dashboard';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Check if user is authenticated
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/login'); // Redirect to login page if not authenticated
  }
  
  // Fetch real dashboard stats
  const stats = await getDashboardStats();
  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">
            {new Date().getHours() < 12 ? 'Good morning!' : 
             new Date().getHours() < 17 ? 'Good afternoon!' : 'Good evening!'}
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* User Profile Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
              <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || 'Admin User'}</h2>
              <p className="text-blue-100">Content Creator & Administrator</p>
              <div className="mt-2 flex space-x-6 text-sm">
                <div>
                  <span className="font-semibold text-lg">{stats.totalPosts}</span>
                  <p className="text-blue-100">Total Posts</p>
                </div>
                <div>
                  <span className="font-semibold text-lg">{stats.totalSubscribers}</span>
                  <p className="text-blue-100">Subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Posts" 
          value={stats.totalPosts.toString()} 
          subtitle={`${stats.publishedPosts} published, ${stats.draftPosts} drafts`}
          icon={<FileText className="h-8 w-8" />} 
          iconBg="bg-blue-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Subscribers" 
          value={stats.totalSubscribers.toLocaleString()} 
          subtitle={stats.recentSubscribers > 0 ? `+${stats.recentSubscribers} this month` : 'No new subscribers'}
          icon={<Users className="h-8 w-8" />} 
          iconBg="bg-purple-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Comments" 
          value={stats.totalComments.toLocaleString()} 
          subtitle="Across all posts"
          icon={<MessageSquare className="h-8 w-8" />} 
          iconBg="bg-green-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Categories" 
          value={stats.totalCategories.toString()} 
          subtitle={stats.topCategories.length > 0 ? `"${stats.topCategories[0].name}" is most active` : 'Active categories'}
          icon={<Tag className="h-8 w-8" />} 
          iconBg="bg-orange-500"
          iconColor="text-white"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Top Categories
            </CardTitle>
            <p className="text-muted-foreground text-sm">Categories by post count</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.length > 0 ? (
                stats.topCategories.slice(0, 5).map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{category.postCount}</span>
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all" 
                          style={{ 
                            backgroundColor: category.color,
                            width: `${Math.max(20, (category.postCount / Math.max(...stats.topCategories.map(c => c.postCount))) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No categories found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <p className="text-muted-foreground text-sm">Common admin tasks</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/posts/new">
                <FileText className="mr-2 h-4 w-4" />
                Write New Post
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/categories">
                <Tag className="mr-2 h-4 w-4" />
                Manage Categories
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/comments">
                <MessageSquare className="mr-2 h-4 w-4" />
                Review Comments ({stats.totalComments})
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/subscribers">
                <Users className="mr-2 h-4 w-4" />
                View Subscribers
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <p className="text-muted-foreground text-sm">Latest post updates</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentPostActivity.length > 0 ? (
                stats.recentPostActivity.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      {activity.action === 'published' && <FileText className="h-4 w-4 text-white" />}
                      {activity.action === 'updated' && <Calendar className="h-4 w-4 text-white" />}
                      {activity.action === 'commented' && <MessageSquare className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <div className="text-xs text-muted-foreground">
                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} • {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Blog Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Blog Summary
            </CardTitle>
            <CardDescription>Overview of your blog content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Published Posts</span>
                </div>
                <span className="text-lg font-bold">{stats.publishedPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Draft Posts</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{stats.draftPosts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Total Comments</span>
                </div>
                <span className="text-lg font-bold">{stats.totalComments}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Email Subscribers</span>
                </div>
                <span className="text-lg font-bold">{stats.totalSubscribers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>Quick start guide for your blog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.totalPosts === 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🎉 Welcome to your blog!
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Get started by creating your first post or setting up categories.
                </p>
                <Button asChild size="sm">
                  <Link href="/admin/posts/new">
                    Create First Post
                  </Link>
                </Button>
              </div>
            )}
            
            {stats.totalCategories === 0 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
                  📂 No categories yet
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  Organize your content by creating categories.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/categories">
                    Add Categories
                  </Link>
                </Button>
              </div>
            )}
            
            {stats.draftPosts > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  ✍️ You have {stats.draftPosts} draft{stats.draftPosts > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Finish and publish your drafts to grow your audience.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/posts?status=draft">
                    View Drafts
                  </Link>
                </Button>
              </div>
            )}
            
            {stats.totalPosts > 0 && stats.totalCategories > 0 && stats.draftPosts === 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  🚀 Your blog is looking great!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Keep creating amazing content for your {stats.totalSubscribers} subscribers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle,
  icon,
  iconBg,
  iconColor
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

