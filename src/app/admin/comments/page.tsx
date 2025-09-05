"use client";

import { Construction, MessageSquare, Clock, User, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CommentsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
          <p className="text-muted-foreground">
            Manage and moderate user comments on your blog posts
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Construction className="w-4 h-4 mr-2" />
          Under Development
        </Badge>
      </div>

      {/* Under Development Notice */}
      <Card className="border-dashed border-2 border-orange-200 bg-orange-50/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
            <Construction className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-orange-900">
            Comments System Coming Soon!
          </h3>
          <p className="text-orange-700 mb-6 max-w-md mx-auto">
            We&apos;re building an awesome comment management system with moderation tools,
            spam detection, and real-time notifications.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Zap className="w-4 h-4" />
              Real-time Moderation
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <MessageSquare className="w-4 h-4" />
              Comment Threading
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <User className="w-4 h-4" />
              User Management
            </div>
          </div>
          <Button variant="outline" disabled>
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Mock Preview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Comment Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
