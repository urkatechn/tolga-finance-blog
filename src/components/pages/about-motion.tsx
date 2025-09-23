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
  Linkedin
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <motion.div 
          className="relative container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              variants={fadeUp}
            >
              <span className="block text-gray-900 dark:text-white mb-2">{settings.aboutme_hero_greeting}</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                {settings.aboutme_hero_title}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              {settings.aboutme_hero_subtitle}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Personal Stats */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {personalStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    variants={fadeUp}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: easing, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <motion.div 
                      className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: easing, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 dark:text-gray-400 text-lg">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* My Story */}
      <section className="py-16">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{settings.aboutme_story_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{settings.aboutme_story_subtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <motion.div variants={slideInLeft}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_story_reality_title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{settings.aboutme_story_reality_content1}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{settings.aboutme_story_reality_content2}</p>
              </motion.div>
              
              <motion.div className="space-y-6" variants={slideInRight}>
                {journeyItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: easing, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{item.year}</span>
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What I Write About */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_topics_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{settings.aboutme_topics_subtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInScale} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <CardTitle className="text-xl">{settings.aboutme_topic_investing_title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">{settings.aboutme_topic_investing_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {investingTags.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge variant="secondary">{t}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInScale} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Heart className="h-6 w-6 text-red-500" />
                      </motion.div>
                      <CardTitle className="text-xl">{settings.aboutme_topic_money_title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">{settings.aboutme_topic_money_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {moneyTags.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge variant="secondary">{t}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Let's Connect */}
      <section className="py-16">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              variants={fadeUp}
            >
              {settings.aboutme_connect_title}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
              variants={fadeUp}
            >
              {settings.aboutme_connect_subtitle}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={fadeUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ContactButton />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                  <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
                    Connect on LinkedIn
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto"
              variants={fadeInScale}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-gray-700 dark:text-gray-300 italic">"{settings.aboutme_connect_quote}"</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_newsletter_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{settings.aboutme_newsletter_description}</p>
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