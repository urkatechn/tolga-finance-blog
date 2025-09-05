"use client";

import { Construction, BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your blog performance and visitor insights
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Construction className="w-4 h-4 mr-2" />
          Under Development
        </Badge>
      </div>

      {/* Under Development Notice */}
      <Card className="border-dashed border-2 border-green-200 bg-green-50/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-green-900">
            Analytics Dashboard Coming Soon!
          </h3>
          <p className="text-green-700 mb-6 max-w-md mx-auto">
            We&apos;re building a comprehensive analytics platform to track your blog&apos;s performance, 
            visitor behavior, and content engagement.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              Traffic Analytics
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Eye className="w-4 h-4" />
              Content Insights
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <MousePointer className="w-4 h-4" />
              User Behavior
            </div>
          </div>
          <Button variant="outline" disabled>
            <Construction className="w-4 h-4 mr-2" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Mock Preview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Avg. Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Large Mock Chart */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-xl">Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
