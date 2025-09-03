import { Metadata } from "next";
import { Plus, Search, Filter, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "./data-table";
import { columns, Post } from "./columns";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Posts | Admin Dashboard",
  description: "Manage your blog posts",
};

// Mock data for posts
const posts: Post[] = [
  {
    id: "post-1",
    title: "Understanding Market Volatility: A Beginner's Guide",
    slug: "understanding-market-volatility",
    status: "published",
    category: "Investing",
    publishedAt: "2025-08-15",
    author: "Jane Smith",
  },
  {
    id: "post-2",
    title: "10 Ways to Save for Your First Home",
    slug: "10-ways-to-save-for-first-home",
    status: "published",
    category: "Saving",
    publishedAt: "2025-08-10",
    author: "John Doe",
  },
  {
    id: "post-3",
    title: "Cryptocurrency: Investment or Speculation?",
    slug: "cryptocurrency-investment-speculation",
    status: "published",
    category: "Crypto",
    publishedAt: "2025-08-05",
    author: "Alex Johnson",
  },
  {
    id: "post-4",
    title: "Retirement Planning in Your 30s",
    slug: "retirement-planning-30s",
    status: "draft",
    category: "Retirement",
    publishedAt: "",
    author: "Sarah Williams",
  },
  {
    id: "post-5",
    title: "The Psychology of Spending",
    slug: "psychology-of-spending",
    status: "draft",
    category: "Personal Finance",
    publishedAt: "",
    author: "Michael Brown",
  },
  {
    id: "post-6",
    title: "Understanding Tax-Advantaged Accounts",
    slug: "tax-advantaged-accounts",
    status: "archived",
    category: "Taxes",
    publishedAt: "2025-07-01",
    author: "Emily Davis",
  },
  {
    id: "post-7",
    title: "How to Read Financial Statements",
    slug: "how-to-read-financial-statements",
    status: "published",
    category: "Education",
    publishedAt: "2025-07-15",
    author: "Robert Wilson",
  },
  {
    id: "post-8",
    title: "The Impact of Inflation on Your Savings",
    slug: "inflation-impact-on-savings",
    status: "published",
    category: "Economy",
    publishedAt: "2025-07-20",
    author: "Lisa Thompson",
  },
];

export default function PostsPage() {
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  const archivedCount = posts.filter(p => p.status === 'archived').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <Badge variant="secondary">{posts.length}</Badge>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">{publishedCount}</p>
            </div>
            <Badge variant="default">{publishedCount}</Badge>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Drafts</p>
              <p className="text-2xl font-bold">{draftCount}</p>
            </div>
            <Badge variant="outline">{draftCount}</Badge>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Archived</p>
              <p className="text-2xl font-bold">{archivedCount}</p>
            </div>
            <Badge variant="secondary">{archivedCount}</Badge>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="investing">Investing</SelectItem>
              <SelectItem value="saving">Saving</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="retirement">Retirement</SelectItem>
              <SelectItem value="personal-finance">Personal Finance</SelectItem>
              <SelectItem value="taxes">Taxes</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Trash2 className="mr-2 h-4 w-4" />
            Bulk Delete
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div>
        <DataTable columns={columns} data={posts} />
      </div>
    </div>
  );
}
