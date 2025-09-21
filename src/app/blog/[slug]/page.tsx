import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { getCachedPostBySlug } from "@/lib/cache";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { PostHeaderWithInteractions } from "@/components/blog/post-header";
import CommentsSection from "@/components/blog/comments-section";
import ReadingProgress from "@/components/blog/reading-progress";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownContent from "@/components/blog/markdown-content";

export const revalidate = 3600; // Revalidate every hour

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: ['Finance Blog'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
    },
  };
}

// Render Markdown content consistently with the editor preview

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getCachedPostBySlug(slug);
  const settings = await getServerSettings();

  if (!post) {
    notFound();
  }

const content = post.content || "";

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <ServerHeader settings={settings} />

      {/* Post header (hero + meta) */}
      <PostHeaderWithInteractions post={post} />

      {/* Main content area with consistent max width */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Article content */}
          <MarkdownContent source={content} />

          {/* Comments Section - aligned to the same width as content */}
          <Suspense
            fallback={
              <div className="space-y-4 mt-12">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <CommentsSection postId={post.id} />
          </Suspense>
        </div>
      </main>

      <ServerFooter settings={settings} />
    </div>
  );
}
