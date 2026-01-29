"use client";

import type { SiteSettings } from "@/contexts/settings-context";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  settings: SiteSettings;
}

const easing = [0.16, 1, 0.3, 1] as const;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } } };

export function ClientFeaturesSection({ settings }: Props) {
  return (
    <section className="py-16">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.landing_section_title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {settings.landing_section_subtitle}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp} className="h-full">
              <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-500 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="p-8 lg:p-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-black mb-4 tracking-tight">Finance & Accounting</CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {settings.feature_1_description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} className="h-full">
              <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:border-green-500/50 dark:hover:border-green-400/50 transition-all duration-500 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="p-8 lg:p-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-inner">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-black mb-4 tracking-tight">Operations</CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {settings.feature_2_description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} className="h-full">
              <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-500 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="p-8 lg:p-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 shadow-inner">
                    <PieChart className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-black mb-4 tracking-tight">Process Development</CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {settings.feature_3_description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

