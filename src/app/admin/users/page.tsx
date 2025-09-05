"use client";

import { Construction, Users, Shield, UserPlus, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Construction className="w-4 h-4 mr-2" />
          Under Development
        </Badge>
      </div>

      {/* Under Development Notice */}
      <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-blue-900">
            User Management Coming Soon!
          </h3>
          <p className="text-blue-700 mb-6 max-w-md mx-auto">
            We&apos;re developing a comprehensive user management system with role-based permissions,
            user authentication, and profile management.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Shield className="w-4 h-4" />
              Role Management
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <UserPlus className="w-4 h-4" />
              User Invitations
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Settings className="w-4 h-4" />
              Permission Control
            </div>
          </div>
          <Button variant="outline" disabled>
            <Construction className="w-4 h-4 mr-2" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Mock Preview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              User List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Admin", "Editor", "Author", "Subscriber"].map((role, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-lg">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
