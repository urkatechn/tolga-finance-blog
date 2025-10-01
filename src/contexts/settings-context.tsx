"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';

export interface SiteSettings {
  // Site Branding
  site_title: string;
  site_description: string;
  site_tagline: string;
  site_keywords: string[];
  site_url: string;
  site_logo_url: string;
  site_favicon_url: string;
  site_brand_name: string;
  site_brand_initials: string;
  
  // Hero Section
  hero_title: string;
  hero_subtitle_primary: string;
  hero_subtitle_secondary: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  
  // Hero Stats
  hero_stats_articles_count: string;
  hero_stats_articles_label: string;
  hero_stats_subscribers_count: string;
  hero_stats_subscribers_label: string;
  hero_stats_success_count: string;
  hero_stats_success_label: string;
  
  // Social Media
  social_twitter: string;
  social_linkedin: string;
  social_github: string;
  social_email: string;
  
  // Brand Colors
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_accent_color: string;
  
  // Content Settings
  posts_per_page: number;
  enable_comments: boolean;
  social_sharing: boolean;
  default_author_id: string;
  
  // Newsletter
  newsletter_title: string;
  newsletter_description: string;
  
  // Footer
  footer_brand_description: string;
  footer_copyright_text: string;
  
  // Landing Page Features
  landing_section_title: string;
  landing_section_subtitle: string;
  feature_1_title: string;
  feature_1_description: string;
  feature_2_title: string;
  feature_2_description: string;
  feature_3_title: string;
  feature_3_description: string;
  
  // SEO Meta
  meta_author: string;
  meta_creator: string;
  meta_og_locale: string;
  meta_og_type: string;
  meta_twitter_card: string;
  meta_twitter_creator: string;

  // About Me Page Settings
  aboutme_hero_greeting: string;
  aboutme_hero_title: string;
  aboutme_hero_subtitle: string;
  
  // Personal Stats
  aboutme_stats_years_value: string;
  aboutme_stats_years_label: string;
  aboutme_stats_articles_value: string;
  aboutme_stats_articles_label: string;
  aboutme_stats_coffee_value: string;
  aboutme_stats_coffee_label: string;
  
  // Story Section
  aboutme_story_title: string;
  aboutme_story_subtitle: string;
  aboutme_story_reality_title: string;
  aboutme_story_reality_content1: string;
  aboutme_story_reality_content2: string;
  
  // Journey Timeline (preferred)
  aboutme_journey_items: Array<{ year: string; title: string; description: string }>;
  
  // Topics Section
  aboutme_topics_title: string;
  aboutme_topics_subtitle: string;
  
  // Topic Cards
  aboutme_topic_investing_title: string;
  aboutme_topic_investing_description: string;
  aboutme_topic_investing_tags: string;
  aboutme_topic_money_title: string;
  aboutme_topic_money_description: string;
  aboutme_topic_money_tags: string;
  
  // Connect Section
  aboutme_connect_title: string;
  aboutme_connect_subtitle: string;
  aboutme_connect_quote: string;
  
  // Newsletter Section
  aboutme_newsletter_title: string;
  aboutme_newsletter_description: string;
  
  // Contact Page Settings
  contact_hero_line1: string;
  contact_hero_title: string;
  contact_hero_subtitle: string;
  contact_linkedin_card_title: string;
  contact_linkedin_card_description: string;
  contact_linkedin_button_text: string;
  contact_response_title: string;
  contact_response_description: string;
  contact_response_time: string;
  contact_form_title: string;
  contact_form_description: string;
  contact_faq_title: string;
  contact_faq_subtitle: string;
  contact_faq_items: Array<{ question: string; answer: string }>;
  contact_faq_enabled: boolean;
  
  // Blog Page Settings
  // Hero Section
  blog_hero_title: string;
  blog_hero_subtitle: string;
  blog_hero_gradient_from: string;
  blog_hero_gradient_via: string;
  blog_hero_gradient_to: string;
  blog_hero_gradient_from_dark: string;
  blog_hero_gradient_via_dark: string;
  blog_hero_gradient_to_dark: string;
  
  // Content & Layout
  blog_posts_per_page: number;
  blog_show_featured_separately: boolean;
  blog_featured_posts_limit: number;
  blog_enable_search: boolean;
  blog_enable_category_filter: boolean;
  blog_enable_sidebar: boolean;
  blog_recent_posts_limit: number;
  
  // Stats Display
  blog_show_stats: boolean;
  blog_stats_articles_label: string;
  blog_stats_categories_label: string;
  blog_stats_featured_label: string;
  
  // Empty State
  blog_empty_title: string;
  blog_empty_description_search: string;
  blog_empty_description_general: string;
  blog_empty_cta_text: string;
  
  // Section Headers
  blog_featured_section_title: string;
  blog_latest_section_title: string;
  
  // UI Customization
  blog_enable_animations: boolean;
  blog_card_hover_effects: boolean;
  blog_show_excerpt: boolean;
  blog_show_read_time: boolean;
  blog_show_comment_count: boolean;
  
  // Blog Sidebar Configuration
  sidebar_show_newsletter: boolean;
  sidebar_newsletter_title: string;
  sidebar_newsletter_description: string;
  sidebar_show_trending: boolean;
  sidebar_trending_title: string;
  sidebar_trending_limit: number;
  sidebar_show_categories: boolean;
  sidebar_categories_title: string;
  sidebar_categories_limit: number;
  sidebar_show_about: boolean;
  sidebar_about_title: string;
  sidebar_about_author_name: string;
  sidebar_about_author_role: string;
  sidebar_about_description: string;
  sidebar_show_stats: boolean;
  sidebar_stats_articles: string;
  sidebar_stats_readers: string;
  sidebar_stats_categories: string;
  sidebar_stats_updated: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSetting: (key: keyof SiteSettings, value: unknown) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper function to create default settings from config
function createDefaultSettings(): SiteSettings {
  return {
    // Site Branding
    site_title: DEFAULT_SITE_CONFIG.site.title,
    site_description: DEFAULT_SITE_CONFIG.site.description,
    site_tagline: DEFAULT_SITE_CONFIG.site.tagline,
    site_keywords: DEFAULT_SITE_CONFIG.meta.keywords,
    site_url: DEFAULT_SITE_CONFIG.site.url,
    site_logo_url: DEFAULT_SITE_CONFIG.site.logoUrl,
    site_favicon_url: DEFAULT_SITE_CONFIG.site.faviconUrl,
    site_brand_name: DEFAULT_SITE_CONFIG.site.brandName,
    site_brand_initials: DEFAULT_SITE_CONFIG.site.brandInitials,
    
    // Hero Section
    hero_title: DEFAULT_SITE_CONFIG.hero.title,
    hero_subtitle_primary: DEFAULT_SITE_CONFIG.hero.subtitlePrimary,
    hero_subtitle_secondary: DEFAULT_SITE_CONFIG.hero.subtitleSecondary,
    hero_cta_primary_text: DEFAULT_SITE_CONFIG.hero.ctaPrimaryText,
    hero_cta_primary_link: DEFAULT_SITE_CONFIG.hero.ctaPrimaryLink,
    hero_cta_secondary_text: DEFAULT_SITE_CONFIG.hero.ctaSecondaryText,
    hero_cta_secondary_link: DEFAULT_SITE_CONFIG.hero.ctaSecondaryLink,
    
    // Hero Stats
    hero_stats_articles_count: DEFAULT_SITE_CONFIG.hero.stats.articlesCount,
    hero_stats_articles_label: DEFAULT_SITE_CONFIG.hero.stats.articlesLabel,
    hero_stats_subscribers_count: DEFAULT_SITE_CONFIG.hero.stats.subscribersCount,
    hero_stats_subscribers_label: DEFAULT_SITE_CONFIG.hero.stats.subscribersLabel,
    hero_stats_success_count: DEFAULT_SITE_CONFIG.hero.stats.successCount,
    hero_stats_success_label: DEFAULT_SITE_CONFIG.hero.stats.successLabel,
    
    // Social Media
    social_twitter: DEFAULT_SITE_CONFIG.meta.twitterCreator,
    social_linkedin: DEFAULT_SITE_CONFIG.social.linkedin,
    social_github: DEFAULT_SITE_CONFIG.social.github,
    social_email: DEFAULT_SITE_CONFIG.social.email,
    
    // Brand Colors
    brand_primary_color: DEFAULT_SITE_CONFIG.brand.primaryColor,
    brand_secondary_color: DEFAULT_SITE_CONFIG.brand.secondaryColor,
    brand_accent_color: DEFAULT_SITE_CONFIG.brand.accentColor,
    
    // Content Settings
    posts_per_page: DEFAULT_SITE_CONFIG.content.postsPerPage,
    enable_comments: DEFAULT_SITE_CONFIG.content.enableComments,
    social_sharing: DEFAULT_SITE_CONFIG.content.socialSharing,
    default_author_id: '',
    
    // Newsletter
    newsletter_title: DEFAULT_SITE_CONFIG.newsletter.title,
    newsletter_description: DEFAULT_SITE_CONFIG.newsletter.description,
    
    // Footer
    footer_brand_description: DEFAULT_SITE_CONFIG.footer.brandDescription,
    footer_copyright_text: DEFAULT_SITE_CONFIG.footer.copyrightText,
    
    // Landing Page Features
    landing_section_title: DEFAULT_SITE_CONFIG.features.sectionTitle,
    landing_section_subtitle: DEFAULT_SITE_CONFIG.features.sectionSubtitle,
    feature_1_title: DEFAULT_SITE_CONFIG.features.items[0].title,
    feature_1_description: DEFAULT_SITE_CONFIG.features.items[0].description,
    feature_2_title: DEFAULT_SITE_CONFIG.features.items[1].title,
    feature_2_description: DEFAULT_SITE_CONFIG.features.items[1].description,
    feature_3_title: DEFAULT_SITE_CONFIG.features.items[2].title,
    feature_3_description: DEFAULT_SITE_CONFIG.features.items[2].description,
    
    // SEO Meta
    meta_author: DEFAULT_SITE_CONFIG.meta.author,
    meta_creator: DEFAULT_SITE_CONFIG.meta.creator,
    meta_og_locale: DEFAULT_SITE_CONFIG.meta.ogLocale,
    meta_og_type: DEFAULT_SITE_CONFIG.meta.ogType,
    meta_twitter_card: DEFAULT_SITE_CONFIG.meta.twitterCard,
    meta_twitter_creator: DEFAULT_SITE_CONFIG.meta.twitterCreator,
    
    // About Me Page Settings - Default values
    aboutme_hero_greeting: "Hey, I'm",
    aboutme_hero_title: "Your Finance Friend",
    aboutme_hero_subtitle: "Just someone who made a lot of financial mistakes so you don't have to. Here's my story.",
    
    // Personal Stats
    aboutme_stats_years_value: "12+",
    aboutme_stats_years_label: "Years Investing",
    aboutme_stats_articles_value: "150+",
    aboutme_stats_articles_label: "Articles Written",
    aboutme_stats_coffee_value: "∞",
    aboutme_stats_coffee_label: "Coffee Consumed",
    
    // Story Section
    aboutme_story_title: "My Financial Journey",
    aboutme_story_subtitle: "Like most people, I learned about money the hard way. Here's how I went from financial disasters to (hopefully) helpful insights.",
    aboutme_story_reality_title: "The Reality Check",
    aboutme_story_reality_content1: "I started investing in 2012 with zero knowledge and maximum confidence. Spoiler alert: it didn't go well. That first 30% loss taught me more than any textbook ever could.",
    aboutme_story_reality_content2: "After years of mistakes, research, and slowly figuring things out, I realized that most financial advice is either too complex or too generic. So I started writing about what actually works in real life.",
    
    // Journey Timeline
    aboutme_journey_items: [
      {
        year: "2012",
        title: "First Investment",
        description: "Made my first stock purchase with $500 from my summer job. Lost 30% in the first month - learned my first lesson about research!",
      },
      {
        year: "2015",
        title: "The Learning Phase",
        description: "Spent countless hours reading financial books, following market news, and making plenty of mistakes along the way.",
      },
      {
        year: "2018",
        title: "Finding My Strategy",
        description: "Developed a disciplined approach to investing focused on long-term value and diversification.",
      },
      {
        year: "2021",
        title: "Started Writing",
        description: "Began sharing my experiences and insights to help others avoid the mistakes I made early on.",
      },
    ],
    
    // Topics Section
    aboutme_topics_title: "What I Actually Write About",
    aboutme_topics_subtitle: "No fluff, no get-rich-quick schemes. Just practical stuff that actually matters.",
    
    // Topic Cards
    aboutme_topic_investing_title: "Investing Reality",
    aboutme_topic_investing_description: "Real talk about building wealth through investing. No day trading nonsense, just long-term strategies that work.",
    aboutme_topic_investing_tags: '["Portfolio Building", "Risk Management", "Market Psychology"]',
    aboutme_topic_money_title: "Money & Life",
    aboutme_topic_money_description: "How to handle money without it taking over your life. Budgeting, saving, and financial planning that actually sticks.",
    aboutme_topic_money_tags: '["Emergency Funds", "Debt Freedom", "Financial Goals"]',
    
    // Connect Section
    aboutme_connect_title: "Let's Connect",
    aboutme_connect_subtitle: "Got questions? Want to share your own financial wins or disasters? I'd love to hear from you.",
    aboutme_connect_quote: "The best investment advice I ever got was from someone who admitted their mistakes. That's what I try to do here - share what works, what doesn't, and what I learned along the way.",
    
    // Newsletter Section
    aboutme_newsletter_title: "Join the Journey",
    aboutme_newsletter_description: "Get my latest thoughts on investing, money, and life delivered weekly. No spam, just honest insights.",
    
    // Contact Page Settings - Default values
    contact_hero_line1: "Let's Chat About",
    contact_hero_title: "Money & Life",
    contact_hero_subtitle: "Got questions? Want to share your financial wins or disasters? Or maybe you just want to tell me I'm completely wrong about something? I'd love to hear from you.",
    contact_linkedin_card_title: "LinkedIn",
    contact_linkedin_card_description: "Connect with me professionally or send a quick message about finance topics.",
    contact_linkedin_button_text: "Connect",
    contact_response_title: "Response Time",
    contact_response_description: "I usually respond within 24-48 hours. Sometimes faster if I'm procrastinating on other work.",
    contact_response_time: "24-48h",
    contact_form_title: "Send Me a Message",
    contact_form_description: "Use this form if you prefer. I read every message, even if it's just to tell me my investment advice is terrible.",
    contact_faq_title: "Common Questions",
    contact_faq_subtitle: "Before you reach out, here are some things people often ask about.",
    contact_faq_items: [
      {
        question: "Can you give me personal financial advice?",
        answer:
          "I'm not a licensed financial advisor, so I can't give personalized advice. But I'm happy to share general thoughts and point you toward good resources!",
      },
      {
        question: "Want to collaborate or guest post?",
        answer:
          "I'm always open to interesting collaborations! Send me your ideas and let's see if we can create something valuable together.",
      },
      {
        question: "How do you handle my information?",
        answer:
          "I respect your privacy. I won't share your email or information with anyone, and I definitely won't spam you with sales pitches.",
      },
      {
        question: "Can I suggest article topics?",
        answer: "Absolutely! I'm always looking for new topics to explore. If there's something you're curious about, let me know.",
      },
    ],
    contact_faq_enabled: true,
    
    // Blog Page Settings - Default values
    // Hero Section
    blog_hero_title: "Blog & Insights",
    blog_hero_subtitle: "Discover the latest insights on finance, investing, and building wealth for your future.",
    blog_hero_gradient_from: "from-slate-50",
    blog_hero_gradient_via: "via-blue-50",
    blog_hero_gradient_to: "to-indigo-50",
    blog_hero_gradient_from_dark: "dark:from-gray-900",
    blog_hero_gradient_via_dark: "dark:via-gray-800",
    blog_hero_gradient_to_dark: "dark:to-gray-900",
    
    // Content & Layout
    blog_posts_per_page: 12,
    blog_show_featured_separately: true,
    blog_featured_posts_limit: 3,
    blog_enable_search: true,
    blog_enable_category_filter: true,
    blog_enable_sidebar: true,
    blog_recent_posts_limit: 5,
    
    // Stats Display
    blog_show_stats: true,
    blog_stats_articles_label: "Articles",
    blog_stats_categories_label: "Categories",
    blog_stats_featured_label: "Featured",
    
    // Empty State
    blog_empty_title: "No articles found",
    blog_empty_description_search: "Try adjusting your search or filter criteria to find more articles.",
    blog_empty_description_general: "No articles have been published yet. Check back soon for new content!",
    blog_empty_cta_text: "View All Articles",
    
    // Section Headers
    blog_featured_section_title: "Featured Articles",
    blog_latest_section_title: "Latest Articles",
    
    // UI Customization
    blog_enable_animations: true,
    blog_card_hover_effects: true,
    blog_show_excerpt: true,
    blog_show_read_time: true,
    blog_show_comment_count: true,
    
    // Blog Sidebar Configuration
    sidebar_show_newsletter: true,
    sidebar_newsletter_title: "Stay Updated",
    sidebar_newsletter_description: "Get the latest financial insights delivered to your inbox weekly.",
    sidebar_show_trending: true,
    sidebar_trending_title: "Trending Posts",
    sidebar_trending_limit: 4,
    sidebar_show_categories: true,
    sidebar_categories_title: "Categories",
    sidebar_categories_limit: 8,
    sidebar_show_about: true,
    sidebar_about_title: "About Finance Blog",
    sidebar_about_author_name: "Finance Blog Team",
    sidebar_about_author_role: "Financial Experts",
    sidebar_about_description: "We're passionate about making finance accessible to everyone. Our team of experts shares insights, tips, and strategies to help you make informed financial decisions.",
    sidebar_show_stats: true,
    sidebar_stats_articles: "50+",
    sidebar_stats_readers: "10K+",
    sidebar_stats_categories: "5",
    sidebar_stats_updated: "24/7",
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/settings', {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create default settings and override with database values
      const defaultSettings = createDefaultSettings();
      const mergedSettings: SiteSettings = { ...defaultSettings };
      
      // Override with database values where they exist
      if (data && typeof data === 'object') {
        Object.keys(mergedSettings).forEach((key) => {
          const settingKey = key as keyof SiteSettings;
          if (data[settingKey] !== undefined && data[settingKey] !== null) {
            try {
              (mergedSettings as unknown as Record<string, unknown>)[settingKey] = data[settingKey];
            } catch (e) {
              console.warn(`Failed to set setting ${settingKey}:`, e);
            }
          }
        });
      }
      
      setSettings(mergedSettings);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use default settings as fallback
      setSettings(createDefaultSettings());
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: unknown) => {
    if (settings) {
      setSettings(prev => prev ? { ...prev, [key]: value } : prev);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const contextValue: SettingsContextType = {
    settings,
    loading,
    refreshSettings,
    updateSetting,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
