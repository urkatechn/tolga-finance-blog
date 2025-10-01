"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown, Eye, Pencil, Trash, Copy, Archive, FileText, Mail, MailCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Define the Post type
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  email_notification_sent: boolean;
  email_notification_sent_at: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
  author?: {
    id: string;
    name: string;
    email: string | null;
    avatar_url: string | null;
  } | null;
};

export const createColumns = (
  handlePublishPost?: (id: string) => void,
  handleUnpublishPost?: (id: string) => void,
  handleDeletePost?: (id: string) => void,
  handleArchivePost?: (id: string) => void,
  handleUnarchivePost?: (id: string) => void,
  handleSendEmailNotification?: (id: string) => void
): ColumnDef<Post>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const slug = row.original.slug;
      const status = row.original.status;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              status === 'published' 
                ? 'bg-gradient-to-br from-green-400 to-blue-500'
                : status === 'archived'
                ? 'bg-gradient-to-br from-orange-400 to-red-500'
                : 'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}>
              <FileText className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <Link 
              href={`/admin/posts/${row.original.id}/edit`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {title}
            </Link>
            <p className="text-sm text-muted-foreground truncate">
              /{slug}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      return (
        <Badge
          variant={
            status === "published"
              ? "default"
              : status === "draft"
              ? "outline"
              : "destructive"
          }
          className={
            status === "archived" 
              ? "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300"
              : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const post = row.original;
      if (!post.category) {
        return <Badge variant="outline">No Category</Badge>;
      }
      return (
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: post.category.color }}
          />
          <span>{post.category.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "published_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const publishedAt = row.getValue("published_at") as string | null;
      if (!publishedAt) {
        return <span className="text-muted-foreground">Not published</span>;
      }
      return <div>{new Date(publishedAt).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const post = row.original;
      if (!post.author) {
        return <span className="text-muted-foreground">No author</span>;
      }
      
      const initials = post.author.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
        
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar_url || ''} alt={post.author.name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.author.name}</div>
            {post.author.email && (
              <div className="text-xs text-muted-foreground">{post.author.email}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "featured",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Featured
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const featured = row.getValue("featured") as boolean;
      return featured ? (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">Yes</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      );
    },
    filterFn: (row, id, value) => {
      // value expected boolean
      return (row.getValue(id) as boolean) === value;
    },
  },
  {
    accessorKey: "email_notification_sent",
    header: "Email Sent",
    cell: ({ row }) => {
      const emailSent = row.getValue("email_notification_sent") as boolean;
      const emailSentAt = row.original.email_notification_sent_at;
      
      if (emailSent && emailSentAt) {
        return (
          <div className="flex items-center gap-1">
            <MailCheck className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600">
              {new Date(emailSentAt).toLocaleDateString()}
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">Not sent</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {post.status === 'published' ? (
              <DropdownMenuItem asChild>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Post</span>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <Eye className="mr-2 h-4 w-4 opacity-50" />
                <span>View Post (Not Published)</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/admin/posts/${post.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`/blog/${post.slug}`)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {post.status === 'published' && (
              <>
                <DropdownMenuItem 
                  onClick={() => handleSendEmailNotification?.(post.id)}
                  disabled={!handleSendEmailNotification}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>
                    {post.email_notification_sent ? 'Resend Email to Subscribers' : 'Send Email to Subscribers'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {post.status === 'draft' ? (
              <DropdownMenuItem onClick={() => handlePublishPost?.(post.id)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Publish</span>
              </DropdownMenuItem>
            ) : post.status === 'published' ? (
              <DropdownMenuItem onClick={() => handleUnpublishPost?.(post.id)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Unpublish</span>
              </DropdownMenuItem>
            ) : null}
            {post.status === 'archived' ? (
              <DropdownMenuItem onClick={() => handleUnarchivePost?.(post.id)}>
                <Archive className="mr-2 h-4 w-4" />
                <span>Unarchive</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleArchivePost?.(post.id)}>
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => handleDeletePost?.(post.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Export default columns for backward compatibility
export const columns = createColumns();
