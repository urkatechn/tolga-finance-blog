"use client";

import type { SiteSettings } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Clock,
  Linkedin,
  Mail
} from "lucide-react";
import ContactForm from "@/components/contact/contact-form";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";
import { motion } from "framer-motion";
import { LocalizedText } from "@/components/localized-text";

interface ContactMotionProps {
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

export function ContactMotion({ settings }: ContactMotionProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-16">
        <div className="absolute inset-0 bg-grid-slate-200/[0.2] dark:bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        <motion.div
          className="relative container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-bottom-2">
                <LocalizedText tKey="contact.get_in_touch" fallback="Get In Touch" />
              </span>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white uppercase italic">
                <LocalizedText tKey="contact.hero_title" fallback="Just one click away!" />
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium"
              variants={fadeUp}
            >
              <LocalizedText tKey="contact.hero_subtitle" fallback="Feel free to reach out to us." />
            </motion.p>

            {/* Response Time Animated Box */}
            <motion.div
              variants={fadeInScale}
              className="inline-block"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="relative px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Clock className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                      <LocalizedText tKey="contact.commitment" fallback="Commitment" />
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                      <LocalizedText tKey="contact.response_time" fallback="MAXIMUM 24H RESPONSE TIME" />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Email Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col h-full justify-between gap-8">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                      <LocalizedText tKey="contact.direct_correspondence_title" fallback="Direct Correspondence" />
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                      <LocalizedText tKey="contact.direct_correspondence_desc" fallback="For institutional inquiries and partnership proposals, please reach out directly via our primary email address." />
                    </p>
                  </div>
                  <a
                    href="mailto:info@tolgatanagardigil.com"
                    className="flex items-center justify-center w-20 h-20 rounded-[24px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-transparent transition-all shadow-xl group-hover:scale-105"
                    aria-label="Send us an email"
                  >
                    <Mail className="w-10 h-10" />
                  </a>
                </div>
              </motion.div>

              {/* LinkedIn & Social Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col h-full justify-between gap-8">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <Linkedin className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                      <LocalizedText tKey="contact.professional_network_title" fallback="Professional Network" />
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                      <LocalizedText tKey="contact.professional_network_desc" fallback="Connect with Tolga Tanagardigil on LinkedIn to stay updated on latest financial insights and network within the industry." />
                    </p>
                  </div>
                  <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest border-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all" asChild>
                    <Link href={LINKEDIN_URL} target="_blank">
                      <LocalizedText tKey="contact.linkedin_button" fallback="Connect on LinkedIn" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.contact_form_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{settings.contact_form_description}</p>
            </motion.div>

            <motion.div variants={fadeInScale}>
              <ContactForm />
            </motion.div>
          </div>
        </motion.div>
      </section >

      {/* FAQ Section */}
      {
        settings.contact_faq_enabled && Array.isArray((settings as any).contact_faq_items) && (settings as any).contact_faq_items.length > 0 && (
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
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.contact_faq_title}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{settings.contact_faq_subtitle}</p>
                </motion.div>

                <motion.div
                  className="grid md:grid-cols-2 gap-8"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.15,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {((settings as any).contact_faq_items as Array<{ question: string; answer: string }>).map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: easing } },
                      }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                            <CardTitle className="text-xl">{item.question}</CardTitle>
                          </div>
                          <CardDescription className="text-base leading-relaxed">{item.answer}</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </section>
        )
      }
    </>
  );
}