import { Suspense } from "react";
import Link from "next/link";
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  BarChart, 
  Clock, 
  ArrowRight,
  FileEdit,
  MessageCircle
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getPostViewsData } from "@/lib/api/dashboard";
import { formatDistanceToNow } from "@/lib/utils";
import { DashboardChart } from "./_components/dashboard-chart";
import { DashboardActivity } from "./_components/dashboard-activity";

export const metadata = {
  title: "Dashboard | Finance Blog Admin",
  description: "Admin dashboard for Finance Blog",
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
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <ViewsChart />
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
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +2.5% from last month
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
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Read Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8.2 min</div>
          <p className="text-xs text-muted-foreground">
            -0.3 min from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function ViewsChart() {
  const viewsData = await getPostViewsData();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Post Views</CardTitle>
        <CardDescription>
          Daily post views for the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <DashboardChart data={viewsData} />
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
      <CardContent>
        <DashboardActivity items={recentPostActivity} />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
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
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

function ActivitySkeleton() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
