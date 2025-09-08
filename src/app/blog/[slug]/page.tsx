import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { getCachedPostBySlug } from "@/lib/cache";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PostHeaderWithInteractions } from "@/components/blog/post-header";
import CommentsSection from "@/components/blog/comments-section";
import ReadingProgress from "@/components/blog/reading-progress";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 3600; // Revalidate every hour

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getCachedPostBySlug(params.slug);
  
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

// Simple content renderer - replace with proper MDX later
function renderContent(content: string) {
  return (
    <div className="prose prose-lg prose-slate dark:prose-invert mx-auto prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getCachedPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const ContentComponent = renderContent(post.content);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <Header />
      
      <PostHeaderWithInteractions post={post} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Article Content */}
            {ContentComponent}

            {/* Comments Section - Wrapped in Suspense for better performance */}
            <div className="max-w-3xl mx-auto">
              <Suspense fallback={
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
              }>
                <CommentsSection postId={post.id} />
              </Suspense>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

