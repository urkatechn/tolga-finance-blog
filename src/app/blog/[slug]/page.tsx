import { notFound } from "next/navigation";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PostHeader from "@/components/blog/post-header";
import TableOfContents from "@/components/blog/table-of-contents";
import ReadingProgress from "@/components/blog/reading-progress";
import RelatedPosts from "@/components/blog/related-posts";
import NewsletterSignup from "@/components/blog/newsletter-signup";
import PostInteractions from "@/components/blog/post-interactions";
import CommentsSection from "@/components/blog/comments-section";
import { getPostBySlug, getPosts } from "@/lib/api/supabase-posts";

export const revalidate = 3600; // Revalidate every hour

// Compile MDX content to React component
async function compileMDX(content: string) {
  try {
    const compiled = await compile(content, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
    });
    
    const { default: MDXContent } = await run(compiled, runtime);
    return MDXContent;
  } catch (error) {
    console.error('Error compiling MDX:', error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts for the same category
  const relatedPosts = await getPosts({
    category: post.category?.name,
    limit: 4,
  });

  const MDXContent = await compileMDX(post.content);

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <Header />
      
      <PostHeader post={post} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Sidebar with TOC and Interactions */}
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-8">
              <TableOfContents content={post.content} />
              <PostInteractions 
                postId={post.id} 
                initialLikes={42} // Mock data - will be from database
                initialComments={8} // Mock data - will be from database
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {MDXContent ? (
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:px-4 prose-blockquote:py-2 prose-table:text-sm">
                  <MDXContent />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Sorry, there was an error loading this article.
                  </p>
                </div>
              )}

              {/* Post Interactions */}
              <PostInteractions 
                postId={post.id} 
                initialLikes={0} 
                initialComments={0} 
              />

              {/* Comments Section */}
              <CommentsSection 
                postId={post.id}
              />

              {/* Newsletter Signup */}
              <div className="mt-16">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
      
      <Footer />
    </div>
  );
}

// Generate static params for known posts
export async function generateStaticParams() {
  const posts = await getPosts({ limit: 50 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
