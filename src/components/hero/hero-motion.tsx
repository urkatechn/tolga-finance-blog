"use client";

import type { SiteSettings } from "@/contexts/settings-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveSubscriberCount } from "./live-subscriber-count";
import { useState, useEffect } from "react";

interface ClientHeroProps {
  settings: SiteSettings;
}

const easing = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easing } },
};

function HeroBackgroundSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms]"
            style={{ backgroundImage: `url(${images[index]})` }}
          />
          {/* Cinematic Slate Overlays */}
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/50" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ClientHeroSection({ settings }: ClientHeroProps) {
  const heroImages = [
    settings.hero_image_1,
    settings.hero_image_2,
    settings.hero_image_3,
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-slate-950 pt-16">
      {/* Background Slider */}
      {heroImages.length > 0 && <HeroBackgroundSlider images={heroImages} />}

      {/* Grid Pattern Overlay - subtle and dark-themed */}
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.4))] pointer-events-none" />

      <motion.div
        className="relative container mx-auto px-6 py-20 lg:py-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div className="mb-8" variants={fadeUp}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 leading-[1.1] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {settings.hero_title}
            </h1>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white/95 mb-4 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
            {settings.hero_subtitle_primary}
          </motion.p>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto drop-shadow-sm">
            {settings.hero_subtitle_secondary}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-500/25">
              <Link href={settings.hero_cta_primary_link}>
                {settings.hero_cta_primary_text} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-white/20 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
              <Link href={settings.hero_cta_secondary_link}>{settings.hero_cta_secondary_text}</Link>
            </Button>
          </motion.div>

          <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="group flex flex-col items-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
              <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors mb-4 border border-blue-500/20 shadow-inner">
                <BookOpen className="h-7 w-7 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">{settings.hero_stats_articles_count}</div>
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest">{settings.hero_stats_articles_label}</div>
            </motion.div>

            <motion.div variants={fadeUp} className="group flex flex-col items-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-green-500/30 transition-all duration-500 shadow-2xl">
              <div className="p-4 rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors mb-4 border border-green-500/20 shadow-inner">
                <Users className="h-7 w-7 text-green-400" />
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">
                <LiveSubscriberCount initialCount={settings.hero_stats_subscribers_count} />
              </div>
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest">{settings.hero_stats_subscribers_label}</div>
            </motion.div>

            <motion.div variants={fadeUp} className="group flex flex-col items-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-purple-500/30 transition-all duration-500 shadow-2xl">
              <div className="p-4 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors mb-4 border border-purple-500/20 shadow-inner">
                <TrendingUp className="h-7 w-7 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tight">{settings.hero_stats_success_count}</div>
              <div className="text-sm font-bold text-white/50 uppercase tracking-widest">{settings.hero_stats_success_label}</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easing }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <svg className="w-full h-12 text-background" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" />
        </svg>
      </motion.div>
    </section>
  );
}

