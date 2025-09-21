import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
  Tag
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/api/dashboard";
import { DashboardActivity } from "@/app/admin/dashboard/_components/dashboard-activity";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard with real-time stats and quick actions",
};

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/admin/posts/new">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Suspense fallback={<CategoriesOverviewSkeleton />}>
          <CategoriesOverview />
        </Suspense>
        
        <Suspense fallback={<QuickActionsSkeleton />}>
          <QuickActions />
        </Suspense>
        
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsCards() {
  const stats = await getDashboardStats();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            {stats.publishedPosts} published, {stats.draftPosts} drafts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubscribers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.recentSubscribers > 0 ? `+${stats.recentSubscribers} this month` : 'No new subscribers this month'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalComments}</div>
          <p className="text-xs text-muted-foreground">
            Across all posts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground">
            {stats.topCategories.length > 0 ? `"${stats.topCategories[0].name}" is most active` : 'Active categories'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function CategoriesOverview() {
  const stats = await getDashboardStats();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Top Categories
        </CardTitle>
        <CardDescription>
          Categories by post count
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.topCategories.length > 0 ? (
          stats.topCategories.map((category, index) => (
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
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all" 
                    style={{ 
                      backgroundColor: category.color,
                      width: `${Math.max(10, (category.postCount / Math.max(...stats.topCategories.map(c => c.postCount))) * 100)}%`
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
      </CardContent>
    </Card>
  );
}

async function QuickActions() {
  const stats = await getDashboardStats();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
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
            View Subscribers ({stats.totalSubscribers})
          </Link>
        </Button>
        
        <div className="pt-2 mt-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">Blog Status</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Published Posts:</span>
              <span className="font-medium">{stats.publishedPosts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Draft Posts:</span>
              <span className="font-medium text-yellow-600">{stats.draftPosts}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function RecentActivity() {
  const { recentPostActivity } = await getDashboardStats();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions on your blog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentPostActivity.length > 0 ? (
          recentPostActivity.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {activity.action === 'published' && <FileText className="w-4 h-4" />}
                {activity.action === 'updated' && <Calendar className="w-4 h-4" />}
                {activity.action === 'commented' && <MessageSquare className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} • {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm" asChild>
          <Link href="/admin/posts">
            View all posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 mb-1 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoriesOverviewSkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-6 bg-muted rounded animate-pulse" />
              <div className="w-16 h-2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickActionsSkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-10 w-full bg-muted rounded animate-pulse" />
        ))}
        <div className="pt-2 mt-4 border-t space-y-2">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActivitySkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
