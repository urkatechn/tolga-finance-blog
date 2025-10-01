"use client";

import PostCard from "@/components/blog/post-card";
import BlogSidebar from "@/components/blog/blog-sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PostWithCategory } from "@/lib/api/supabase-posts";
import type { SiteSettings } from "@/contexts/settings-context";

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
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
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
                    {/* Featured Posts Section */}
                    {showingFeaturedSeparately && (
                      <motion.div className="mb-16" variants={fadeUp}>
                        <motion.div 
                          className="flex items-center gap-3 mb-8"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, ease: easing }}
                          viewport={{ once: true }}
                        >
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{settings.blog_featured_section_title}</h2>
                          <motion.div 
                            className="h-px bg-gradient-to-r from-blue-600 to-transparent flex-1"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
                            viewport={{ once: true }}
                            style={{ originX: 0 }}
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-0"
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, amount: 0.1 }}
                        >
                        {featuredPosts.slice(0, settings.blog_featured_posts_limit).map((post, index) => (
                            <motion.div 
                              key={post.id}
                              variants={postCardVariant}
                              whileHover={{ x: 8 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <PostCard post={post} featured={true} commentCount={commentsCountMap[post.id] || 0} settings={settings} />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* All Posts Section */}
                    <motion.div variants={fadeUp}>
                      <motion.div 
                        className="flex items-center justify-between mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easing }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {sp.category && sp.category !== "all" 
                              ? `${categories.find(c => c.slug === sp.category)?.name || sp.category} Articles`
                              : sp.search 
                                ? `Search Results for "${sp.search}"`
                                : settings.blog_latest_section_title
                            }</h2>
                          <motion.span 
                            className="text-sm text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: easing, delay: 0.1 }}
                            viewport={{ once: true }}
                          >
                            ({listPosts.length} {listPosts.length === 1 ? 'article' : 'articles'})
                          </motion.span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-0"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                      >
                        {listPosts.map((post, index) => (
                          <motion.div 
                            key={post.id}
                            variants={postCardVariant}
                            whileHover={{ x: 8 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <PostCard 
                              post={post} 
                              showFeaturedBadge={showFeaturedBadgeInList} 
                              commentCount={commentsCountMap[post.id] || 0} 
                              settings={settings}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
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
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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