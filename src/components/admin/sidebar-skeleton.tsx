"use client";

import { 
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarSkeletonProps {
  count?: number;
}

export function SidebarSkeleton({ count = 6 }: SidebarSkeletonProps) {
  return (
    <SidebarMenu>
      {[...Array(count)].map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton>
            <div className="flex items-center gap-2 w-full animate-pulse">
              <div className="size-4 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="h-4 bg-gray-200 rounded flex-1 max-w-20"></div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarHeaderSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex items-center gap-2 w-full animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200"></div>
            <div className="grid flex-1 gap-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface PageSkeletonProps {
  showHeader?: boolean;
  showStats?: boolean;
  showTable?: boolean;
  showCards?: boolean;
  cardCount?: number;
}

export function PageSkeleton({ 
  showHeader = true, 
  showStats = true, 
  showTable = true, 
  showCards = false,
  cardCount = 3 
}: PageSkeletonProps) {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      )}

      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards Skeleton */}
      {showCards && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(cardCount)].map((_, i) => (
            <div key={i} className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Skeleton */}
      {showTable && (
        <div className="bg-white border rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
