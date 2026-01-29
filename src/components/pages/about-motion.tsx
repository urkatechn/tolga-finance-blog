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
      {/* LinkedIn Style Profile Header */}
      <section className="relative pt-24 pb-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Cover Image / Gradient */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-grid-white/[0.2] [mask-image:linear-gradient(0deg,white,transparent)]" />
              <div className="absolute top-0 right-0 p-6">
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white/80">
                  Professional Profile
                </div>
              </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="px-8 md:px-12 pb-12 relative">
              <div className="relative -mt-16 md:-mt-20 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: easing }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-white dark:bg-slate-900 p-2 shadow-2xl border-4 border-white dark:border-slate-800"
                >
                  <div className="w-full h-full rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl md:text-5xl font-black text-slate-400">
                    {settings.site_brand_initials || "TT"}
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95" asChild>
                    <Link href="/contact">Message</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-2xl px-8 font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" asChild>
                    <Link href={LINKEDIN_URL} target="_blank">Connect</Link>
                  </Button>
                </div>
              </div>

              <div className="max-w-3xl">
                <motion.h1
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight"
                >
                  {settings.site_brand_name}
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed"
                >
                  {settings.aboutme_hero_title}
                </motion.p>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Strategic Advisor
                  </span>
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Global Finance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Experiences Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Professional Heritage</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Professional Experiences</h2>
            </div>

            <div className="space-y-12">
              {journeyItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 md:gap-12 pb-12 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1">
                    <span className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{item.year}</span>
                    <div className="h-px w-8 md:w-full bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-600 transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Description (Stats integrated) */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4 uppercase text-[10px] tracking-[0.2em] text-slate-500">Professional Summary</h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-normal">
                <p>{settings.aboutme_story_reality_content1}</p>
                <p>{settings.aboutme_story_reality_content2}</p>
              </div>
            </div>

            <div className="lg:w-1/3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4 uppercase text-[10px] tracking-[0.2em] text-slate-500">Key Statistics</h2>
              <div className="space-y-6">
                {personalStats.map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Networking Section (Replaces Let's Connect) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/[0.3] dark:bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} className="mb-12">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Professional Engagement</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter italic uppercase">Networking</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                Bridge the gap between vision and reality. Initiate a professional engagement through our secure channels.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={fadeInScale}>
                <Button size="lg" className="w-full h-24 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group" asChild>
                  <Link href={`mailto:${settings.social_email}`}>
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Send E-mail</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeInScale}>
                <Button size="lg" className="w-full h-24 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group" asChild>
                  <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                    <div className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 group-hover:scale-110 transition-transform">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">LinkedIn Connect</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeInScale}>
                <Button size="lg" className="w-full h-24 bg-blue-600 hover:bg-blue-500 text-white border-0 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 group" asChild>
                  <a href={settings.google_meet_url} target="_blank" rel="noopener noreferrer">
                    <div className="p-2 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Meeting Request</span>
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
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