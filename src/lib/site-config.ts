// Fallback constants for when database settings are not available
// These will be overridden by database settings when the app loads

export const DEFAULT_SITE_CONFIG = {
  // Social Media (for backward compatibility and fallbacks)
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/ttolgatan/",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com",
    email: "info@tolgatanagardigil.com",
  },
  
  // Site Branding
  site: {
    title: "Finance Blog",
    description: "Your guide to financial freedom and wealth building",
    tagline: "Your guide to financial freedom and wealth building",
    url: "https://www.tolgatanagardigil.com",
    brandName: "Finance Blog",
    brandInitials: "FB",
    logoUrl: "",
    faviconUrl: "/favicon.ico",
  },
  
  // Hero Section
  hero: {
    title: "Smart Financial Insights & Analysis",
    subtitlePrimary: "No need to endlessly search the internet anymore",
    subtitleSecondary: "Let us identify and explain the important financial issues for you. Get expert insights on investing, personal finance, and market trends.",
    ctaPrimaryText: "Read Latest Articles",
    ctaPrimaryLink: "/blog",
    ctaSecondaryText: "Get Weekly Insights",
    ctaSecondaryLink: "#newsletter",
    stats: {
      articlesCount: "150+",
      articlesLabel: "Expert Articles",
      subscribersCount: "25K+",
      subscribersLabel: "Subscribers",
      successCount: "98%",
      successLabel: "Success Rate",
    },
  },
  
  // Brand Colors
  brand: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#8B5CF6",
  },
  
  // Content Settings
  content: {
    postsPerPage: 10,
    enableComments: true,
    socialSharing: true,
  },
  
  // Newsletter
  newsletter: {
    title: "Join the Journey",
    description: "Get my latest thoughts on investing, money, and life delivered weekly. No spam, no sales pitches - just honest insights from someone still figuring it out.",
  },
  
  // Footer
  footer: {
    brandDescription: "Your friendly guide to making smarter financial decisions. No fluff, no get-rich-quick schemes - just honest insights from someone who has made plenty of mistakes so you do not have to.",
    copyrightText: "Made with ❤️ for better financial decisions.",
  },
  
  // Landing Page Features
  features: {
    sectionTitle: "What You'll Find Here",
    sectionSubtitle: "Real financial advice from someone who has made the mistakes so you do not have to",
    items: [
      {
        title: "Honest Investing",
        description: "No get-rich-quick schemes. Just real strategies for building wealth over time, including the mistakes I made along the way.",
      },
      {
        title: "Money That Works",
        description: "Practical budgeting, saving, and debt strategies that actually fit into real life. No perfect spreadsheets required.",
      },
      {
        title: "Simple Portfolios",
        description: "Build diversified portfolios without the complexity. Learn what works and what doesn't from 12+ years of trial and error.",
      },
    ],
  },
  
  // SEO Meta
  meta: {
    keywords: ["finance", "investing", "money", "retirement", "blog"],
    author: "Finance Blog Team",
    creator: "Finance Blog Team",
    ogLocale: "en_US",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterCreator: "@financeblog",
  },
};

// Legacy exports for backward compatibility
export const LINKEDIN_URL = DEFAULT_SITE_CONFIG.social.linkedin;
export const TWITTER_URL = DEFAULT_SITE_CONFIG.social.twitter;
export const GITHUB_URL = DEFAULT_SITE_CONFIG.social.github;
