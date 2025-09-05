import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, TrendingUp, Eye, Heart, Plus } from "lucide-react";
import DatabaseVerify from '@/components/admin/database-setup';
import { getUser } from '@/lib/supabase/user';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  // Check if user is authenticated
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/login'); // Redirect to login page if not authenticated
  }
  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">Good evening!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src="" alt="Henry Qells" />
              <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                HQ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Henry Qells</h2>
              <p className="text-blue-100">Writer/Author</p>
              <div className="mt-2 flex space-x-6 text-sm">
                <div>
                  <span className="font-semibold text-lg">32</span>
                  <p className="text-blue-100">Total Post</p>
                </div>
                <div>
                  <span className="font-semibold text-lg">23K</span>
                  <p className="text-blue-100">Subscriber</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                1K Likes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Post" 
          value="154" 
          icon={<FileText className="h-8 w-8" />} 
          iconBg="bg-blue-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Total Pages" 
          value="56" 
          icon={<Eye className="h-8 w-8" />} 
          iconBg="bg-purple-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Comments" 
          value="34,267" 
          icon={<MessageSquare className="h-8 w-8" />} 
          iconBg="bg-green-500"
          iconColor="text-white"
        />
        <StatCard 
          title="Total Likes" 
          value="65.26K" 
          icon={<Heart className="h-8 w-8" />} 
          iconBg="bg-pink-500"
          iconColor="text-white"
        />
      </div>

      {/* Visitors Analytics */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Visitors</CardTitle>
                <p className="text-muted-foreground text-sm">New Visitors</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">250K</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  2.5%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Blogs</CardTitle>
              <Button variant="outline" size="sm">
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.slice(0, 4).map((post) => (
                <div key={post.id} className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <Eye className="h-3 w-3" />
                      <span>{post.views} Views</span>
                      <MessageSquare className="h-3 w-3" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Database Management</CardTitle>
          <CardDescription>
            Verify your database setup and initialize default data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DatabaseVerify />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon,
  iconBg,
  iconColor
}: { 
  title: string; 
  value: string; 
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
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

const recentPosts = [
  {
    id: 1,
    title: "Clever Ways to Celebrate Christmas on a Budget",
    date: "Dec 20, 2024",
    comments: 25,
    views: "1.2K",
  },
  {
    id: 2,
    title: "Setting Intentions Instead of Resolutions for 2025",
    date: "Dec 15, 2024",
    comments: 18,
    views: "965",
  },
  {
    id: 3,
    title: "Physical Development Activities for Financial Growth",
    date: "Dec 10, 2024",
    comments: 12,
    views: "842",
  },
  {
    id: 4,
    title: "Lilu Trike - A Compact Trike with Big Potential",
    date: "Dec 5, 2024",
    comments: 8,
    views: "653",
  },
];

