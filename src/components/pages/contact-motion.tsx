"use client";

import type { SiteSettings } from "@/contexts/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Clock,
  Linkedin
} from "lucide-react";
import ContactForm from "@/components/contact/contact-form";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";
import { motion } from "framer-motion";

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
              <span className="block text-gray-900 dark:text-white mb-2">{settings.contact_hero_line1}</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">{settings.contact_hero_title}</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              {settings.contact_hero_subtitle}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              
              {/* LinkedIn */}
              <motion.div variants={slideInLeft} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: easing }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Linkedin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <CardTitle className="text-xl">{settings.contact_linkedin_card_title}</CardTitle>
                    <CardDescription className="text-base">{settings.contact_linkedin_card_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" asChild className="w-full justify-center">
                        <Link href={settings.social_linkedin || LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                          {settings.contact_linkedin_button_text}
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Response Time */}
              <motion.div variants={slideInRight} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: easing, delay: 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <CardTitle className="text-xl">{settings.contact_response_title}</CardTitle>
                    <CardDescription className="text-base">{settings.contact_response_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-2xl font-bold text-green-600 dark:text-green-400"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {settings.contact_response_time}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
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
      </section>

      {/* FAQ Section */}
      {settings.contact_faq_enabled && Array.isArray((settings as any).contact_faq_items) && (settings as any).contact_faq_items.length > 0 && (
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
      )}
    </>
  );
}