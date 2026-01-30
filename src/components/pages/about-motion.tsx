"use client";

import type { SiteSettings } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  BookOpen,
  TrendingUp,
  Heart,
  Linkedin,
  Mail,
  Calendar
} from "lucide-react";
import NewsletterSignup from "@/components/blog/newsletter-signup";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";
import ContactButton from "@/components/ui/contact-button";
import { motion } from "framer-motion";
import { LocalizedText } from "@/components/localized-text";

interface AboutMotionProps {
  settings: SiteSettings;
}

const easing = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easing } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easing } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easing } },
};

export function AboutMotion({ settings }: AboutMotionProps) {
  const personalStats = [
    { label: settings.aboutme_stats_years_label, value: settings.aboutme_stats_years_value, icon: TrendingUp },
    { label: settings.aboutme_stats_articles_label, value: settings.aboutme_stats_articles_value, icon: BookOpen },
    { label: settings.aboutme_stats_coffee_label, value: settings.aboutme_stats_coffee_value, icon: Coffee },
  ];

  const settingsWithJourney = settings as typeof settings & { aboutme_journey_items?: Array<{ year: string; title: string; description: string }> };
  const journeyItems = Array.isArray(settingsWithJourney.aboutme_journey_items)
    ? settingsWithJourney.aboutme_journey_items
    : [];

  const parseTags = (v: unknown): string[] => {
    if (Array.isArray(v)) return v as string[];
    if (typeof v === 'string') {
      try {
        const arr = JSON.parse(v);
        return Array.isArray(arr) ? (arr as string[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const settingsWithTags = settings as typeof settings & {
    aboutme_topic_investing_tags?: unknown;
    aboutme_topic_money_tags?: unknown;
  };
  const investingTags = parseTags(settingsWithTags.aboutme_topic_investing_tags);
  const moneyTags = parseTags(settingsWithTags.aboutme_topic_money_tags);

  return (
    <>
      {/* Simplified Hero Section */}
      <section className="relative pt-32 pb-20 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-slate-200/[0.2] dark:bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,transparent)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easing }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-blue-600 mx-auto mb-8 flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-2xl shadow-blue-500/20"
            >
              {settings.site_brand_initials || "TT"}
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show">
              <motion.h1 
                variants={fadeUp}
                className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
              >
                {settings.site_brand_name}
              </motion.h1>
              
              <motion.p 
                variants={fadeUp}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                {settings.aboutme_hero_title}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105" asChild>
                  <Link href="/contact"><LocalizedText tKey="button.message" fallback="Message" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 rounded-2xl font-bold border-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                  <Link href={LINKEDIN_URL} target="_blank"><LocalizedText tKey="button.connect" fallback="Connect" /></Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Summary Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                <div className="w-1 h-1 rounded-full bg-blue-600" />
                <LocalizedText tKey="about.professional_summary" fallback="About Me" />
              </div>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                <p className="font-medium text-slate-900 dark:text-white leading-relaxed">
                  {settings.aboutme_story_reality_content1}
                </p>
                <p className="font-normal">
                  {settings.aboutme_story_reality_content2}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4">
                {personalStats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Experience Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic mb-4">
                <LocalizedText tKey="about.professional_experiences" fallback="The Journey" />
              </h2>
              <div className="w-12 h-1.5 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div className="space-y-16">
              {journeyItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-600 group-hover:bg-blue-600 transition-all duration-300" />
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-slate-900 dark:bg-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-white/[0.2]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Ready to collaborate?
            </h2>
            <p className="text-blue-100/70 text-lg mb-10 font-medium max-w-xl mx-auto">
              Initiate a professional engagement or request a consultation. Let's build something extraordinary together.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href={`mailto:${settings.social_email}`} className="flex items-center gap-3 text-white font-bold hover:text-blue-400 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                {settings.social_email}
              </Link>
              <a href={settings.google_meet_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white font-bold hover:text-blue-400 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Newsletter Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">
                {settings.aboutme_newsletter_title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                {settings.aboutme_newsletter_description}
              </p>
            </motion.div>
            <motion.div className="max-w-2xl mx-auto" variants={fadeInScale}>
              <NewsletterSignup />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}