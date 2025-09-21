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
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                  <CardTitle className="text-xl mb-2">{settings.feature_1_title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {settings.feature_1_description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-green-600 mb-4" />
                  <CardTitle className="text-xl mb-2">{settings.feature_2_title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {settings.feature_2_description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <PieChart className="h-8 w-8 text-purple-600 mb-4" />
                  <CardTitle className="text-xl mb-2">{settings.feature_3_title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
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

