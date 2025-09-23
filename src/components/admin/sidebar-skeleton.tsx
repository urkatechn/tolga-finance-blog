"use client";

import { 
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarSkeletonProps {
  count?: number;
}

export function SidebarSkeleton({ count = 6 }: SidebarSkeletonProps) {
  return (
    <SidebarMenu>
      {[...Array(count)].map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton>
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="size-4 rounded flex-shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-20" />
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
          <div className="flex items-center gap-2 w-full">
            <Skeleton className="aspect-square size-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
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
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
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
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
