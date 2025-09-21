import { Metadata } from "next";
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
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import NewsletterSignup from "@/components/blog/newsletter-signup";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";
import ContactButton from "@/components/ui/contact-button";

export const metadata: Metadata = {
  title: "About Me | Finance Blog",
  description: "Hi, I'm a finance enthusiast sharing my journey and insights to help others navigate their financial decisions.",
};

// Force dynamic rendering to avoid build-time Supabase issues
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getServerSettings();
  const personalStats = [
    { label: settings.aboutme_stats_years_label, value: settings.aboutme_stats_years_value, icon: TrendingUp },
    { label: settings.aboutme_stats_articles_label, value: settings.aboutme_stats_articles_value, icon: BookOpen },
    { label: settings.aboutme_stats_coffee_label, value: settings.aboutme_stats_coffee_value, icon: Coffee },
  ];

  const journeyItems = Array.isArray((settings as any).aboutme_journey_items)
    ? ((settings as any).aboutme_journey_items as Array<{ year: string; title: string; description: string }>)
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

  const investingTags = parseTags((settings as any).aboutme_topic_investing_tags);
  const moneyTags = parseTags((settings as any).aboutme_topic_money_tags);

  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white mb-2">{settings.aboutme_hero_greeting}</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                {settings.aboutme_hero_title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{settings.aboutme_hero_subtitle}</p>
          </div>
        </div>
      </section>

      {/* Personal Stats */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {personalStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-lg">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{settings.aboutme_story_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{settings.aboutme_story_subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_story_reality_title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{settings.aboutme_story_reality_content1}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{settings.aboutme_story_reality_content2}</p>
              </div>
              
              <div className="space-y-6">
                {journeyItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{item.year}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Write About */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_topics_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{settings.aboutme_topics_subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl">{settings.aboutme_topic_investing_title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">{settings.aboutme_topic_investing_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {investingTags.map((t, i) => (
                      <Badge key={i} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <Heart className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-xl">{settings.aboutme_topic_money_title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">{settings.aboutme_topic_money_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {moneyTags.map((t, i) => (
                      <Badge key={i} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{settings.aboutme_connect_title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">{settings.aboutme_connect_subtitle}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <ContactButton />
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  Connect on LinkedIn
                </Link>
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300 italic">&quot;{settings.aboutme_connect_quote}&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{settings.aboutme_newsletter_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{settings.aboutme_newsletter_description}</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
      
      <ServerFooter settings={settings} />
    </div>
  );
}
