"use client";

import PostCard from "@/components/blog/post-card";
import BlogSidebar from "@/components/blog/blog-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PostWithCategory } from "@/lib/api/supabase-posts";
import type { SiteSettings } from "@/contexts/settings-context";
import { AdminBlogBar } from "@/components/blog/admin-blog-bar";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface BlogMotionProps {
  posts: PostWithCategory[];
  categories: Category[];
  recentPosts: PostWithCategory[];
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
  commentsCountMap: Record<string, number>;
  hasNext: boolean;
  page: number;
  settings: SiteSettings;
  isAdmin?: boolean;
}

const easing = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easing } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easing } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easing } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const postCardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing } },
};

export function BlogMotion({
  posts,
  categories,
  recentPosts,
  searchParams: sp,
  commentsCountMap,
  hasNext,
  page,
  settings,
  isAdmin = false,
}: BlogMotionProps) {
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);
  const showingFeaturedSeparately = settings.blog_show_featured_separately && featuredPosts.length > 0 && !sp.search && !sp.category;
  const listPosts = showingFeaturedSeparately
    ? (regularPosts.length > 0 ? regularPosts : featuredPosts)
    : posts;
  const showFeaturedBadgeInList = showingFeaturedSeparately && regularPosts.length === 0;

  // Animation settings
  const enableAnimations = settings.blog_enable_animations ?? true;

  // Dynamic hero gradient classes
  const heroGradientClass = `py-16 bg-gradient-to-br ${settings.blog_hero_gradient_from} ${settings.blog_hero_gradient_via} ${settings.blog_hero_gradient_to} ${settings.blog_hero_gradient_from_dark} ${settings.blog_hero_gradient_via_dark} ${settings.blog_hero_gradient_to_dark}`;

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className={heroGradientClass}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              variants={fadeUp}
            >
              <span className="block text-transparent bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                {settings.blog_hero_title}
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              {settings.blog_hero_subtitle}
            </motion.p>

            {/* Quick Stats */}
            {settings.blog_show_stats && (
              <motion.div
                className="flex flex-wrap justify-center gap-8 text-center"
                variants={fadeUp}
              >
                <div className="flex flex-col">
                  <motion.div
                    className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {posts.length}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{settings.blog_stats_articles_label}</div>
                </div>
                <div className="flex flex-col">
                  <motion.div
                    className="text-3xl font-bold text-purple-600 dark:text-purple-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: easing, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {categories.length}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{settings.blog_stats_categories_label}</div>
                </div>
                <div className="flex flex-col">
                  <motion.div
                    className="text-3xl font-bold text-green-600 dark:text-green-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: easing, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {featuredPosts.length}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{settings.blog_stats_featured_label}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={container}
        >
          <div className="max-w-7xl mx-auto">
            <div className={`lg:grid ${settings.blog_enable_sidebar ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} lg:gap-8`}>
              {/* Main Content Area */}
              <motion.div className={settings.blog_enable_sidebar ? "lg:col-span-8" : "lg:col-span-12"} variants={slideInLeft}>
                {isAdmin && <AdminBlogBar posts={posts} />}

                {posts.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    variants={fadeInScale}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: easing }}
                      viewport={{ once: true }}
                    >
                      <div className="text-4xl">📚</div>
                    </motion.div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No articles found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {sp.search || sp.category
                        ? "Try adjusting your search or filter criteria to find more articles."
                        : "No articles have been published yet. Check back soon for new content!"
                      }
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild>
                        <Link href="/blog">View All Articles</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    {/* Featured Posts Section (Conditional) */}
                    {showingFeaturedSeparately && (
                      <motion.div className="mb-12" variants={fadeUp}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                            {settings.blog_featured_section_title}
                          </h2>
                        </div>
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                          {featuredPosts.slice(0, settings.blog_featured_posts_limit).map((post) => (
                            <motion.div
                              key={post.id}
                              variants={postCardVariant}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <PostCard post={post} featured={true} commentCount={commentsCountMap[post.id] || 0} settings={settings} />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* All Posts Grouped by Category */}
                    <motion.div variants={fadeUp} className="space-y-10">
                      {/* Define grouping logic */}
                      {Object.entries(
                        listPosts.reduce((acc, post) => {
                          const catName = post.category?.name || "Uncategorized";
                          if (!acc[catName]) acc[catName] = [];
                          acc[catName].push(post);
                          return acc;
                        }, {} as Record<string, typeof listPosts>)
                      ).map(([catName, posts]) => (
                        <div key={catName} className="relative">
                          {/* Category Header */}
                          <div className="flex items-center justify-between mb-4 sticky top-0 z-10 py-2 bg-unified/80 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-1.5 h-5 rounded-full"
                                style={{ backgroundColor: posts[0].category?.color || '#cbd5e1' }}
                              />
                              <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 dark:text-slate-100">
                                {catName}
                              </h3>
                              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 dark:border-slate-800 text-slate-400">
                                {posts.length}
                              </Badge>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4 hidden sm:block opacity-50" />
                          </div>

                          {/* Posts in list/forum style */}
                          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {posts.map((post) => (
                              <motion.div
                                key={post.id}
                                variants={postCardVariant}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <PostCard
                                  post={post}
                                  showFeaturedBadge={showFeaturedBadgeInList}
                                  commentCount={commentsCountMap[post.id] || 0}
                                  settings={settings}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Sidebar */}
              {settings.blog_enable_sidebar && (
                <motion.div
                  className="lg:col-span-4 mt-12 lg:mt-0"
                  variants={slideInRight}
                >
                  <motion.div
                    className="sticky top-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: easing, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <BlogSidebar
                      recentPosts={recentPosts}
                      categories={categories}
                      settings={settings}
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pagination Controls */}
      {(hasNext || page > 1) && (
        <motion.section
          className="pb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className={`lg:grid ${settings.blog_enable_sidebar ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} lg:gap-8`}>
                <div className={settings.blog_enable_sidebar ? "lg:col-span-8" : "lg:col-span-12"}>
                  <motion.div
                    className="flex items-center justify-between mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div>
                      {page > 1 && (
                        <motion.div
                          whileHover={{ x: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link
                            href={`/blog?${new URLSearchParams({
                              ...(sp.category ? { category: sp.category } : {}),
                              ...(sp.search ? { search: sp.search } : {}),
                              page: String(page - 1),
                            }).toString()}`}
                            className="inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 hover:text-slate-600 font-medium transition-colors"
                          >
                            <span>←</span> Previous
                          </Link>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      className="text-sm text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      Page {page}
                    </motion.div>

                    <div>
                      {hasNext && (
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link
                            href={`/blog?${new URLSearchParams({
                              ...(sp.category ? { category: sp.category } : {}),
                              ...(sp.search ? { search: sp.search } : {}),
                              page: String(page + 1),
                            }).toString()}`}
                            className="inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 hover:text-slate-600 font-medium transition-colors"
                          >
                            Next <span>→</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </>
  );
}