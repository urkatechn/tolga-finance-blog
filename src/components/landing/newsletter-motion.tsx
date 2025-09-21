"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/contexts/settings-context";
import NewsletterSignup from "@/components/blog/newsletter-signup";

interface Props {
  settings: SiteSettings;
}

const easing = [0.16, 1, 0.3, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } } };

export function ClientNewsletterSection({ settings }: Props) {
  return (
    <section id="newsletter" className="py-16">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {settings.newsletter_title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {settings.newsletter_description}
            </p>
          </motion.div>
          <motion.div className="max-w-2xl mx-auto" variants={fadeUp}>
            <NewsletterSignup />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

