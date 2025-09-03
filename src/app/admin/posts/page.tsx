import { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns, Post } from "./columns";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles.
          </p>
        </div>
        <Button asChild>
          <a href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </a>
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={posts} />
      </div>
    </div>
  );
}
