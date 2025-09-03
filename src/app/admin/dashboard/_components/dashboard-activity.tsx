"use client";

import Link from "next/link";
import Image from "next/image";
import { FileEdit, MessageCircle, Upload } from "lucide-react";
import { PostActivity } from "@/lib/api/dashboard";
import { formatDistanceToNow } from "date-fns";

interface DashboardActivityProps {
  items: PostActivity[];
}

export function DashboardActivity({ items }: DashboardActivityProps) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-4">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border">
            <Image
              src={item.user.avatar}
              alt={item.user.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.user.name}</span>
              <span className="text-muted-foreground">
                {getActivityText(item.action)}
              </span>
              <Link 
                href={`/admin/posts/${item.id}/edit`}
                className="font-medium hover:underline"
              >
                {item.title}
              </Link>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              {getActivityIcon(item.action)}
              <span className="ml-1">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No recent activity
        </div>
      )}
    </div>
  );
}

function getActivityText(action: PostActivity["action"]) {
  switch (action) {
    case "published":
      return "published";
    case "updated":
      return "updated";
    case "commented":
      return "commented on";
    default:
      return "interacted with";
  }
}

function getActivityIcon(action: PostActivity["action"]) {
  switch (action) {
    case "published":
      return <Upload className="h-3 w-3" />;
    case "updated":
      return <FileEdit className="h-3 w-3" />;
    case "commented":
      return <MessageCircle className="h-3 w-3" />;
    default:
      return null;
  }
}
