import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, BookOpen, DollarSign, PieChart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import type { SiteSettings } from "@/contexts/settings-context";
import NewsletterSignup from "@/components/blog/newsletter-signup";
import Image from "next/image";
import { MobileNavigation } from "@/components/mobile-navigation";

interface ServerHeaderProps {
  settings: SiteSettings;
}

export function ServerHeader({ settings }: ServerHeaderProps) {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Login", href: "/auth/login" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {settings.site_logo_url ? (
                <Image
                  src={settings.site_logo_url}
                  alt={settings.site_brand_name}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              ) : (
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {settings.site_brand_initials || settings.site_brand_name?.charAt(0) || 'B'}
                </div>
              )}
              <span className="font-bold text-xl">{settings.site_brand_name}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <MobileNavigation navigation={navigation} />
          </div>

        </div>
      </div>
    </header>
  );
}

interface ServerHeroSectionProps {
  settings: SiteSettings;
}

export function ServerHeroSection({ settings }: ServerHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                {settings.hero_title}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            {settings.hero_subtitle_primary}
          </p>
          
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {settings.hero_subtitle_secondary}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
              <Link href={settings.hero_cta_primary_link}>
                {settings.hero_cta_primary_text} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
              <Link href={settings.hero_cta_secondary_link}>
                {settings.hero_cta_secondary_text}
              </Link>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{settings.hero_stats_articles_count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{settings.hero_stats_articles_label}</div>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{settings.hero_stats_subscribers_count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{settings.hero_stats_subscribers_label}</div>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{settings.hero_stats_success_count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{settings.hero_stats_success_label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white dark:text-gray-900"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

interface ServerFeaturesProps {
  settings: SiteSettings;
}

export function ServerFeaturesSection({ settings }: ServerFeaturesProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.landing_section_title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {settings.landing_section_subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                <CardTitle className="text-xl mb-2">{settings.feature_1_title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {settings.feature_1_description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-600 mb-4" />
                <CardTitle className="text-xl mb-2">{settings.feature_2_title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {settings.feature_2_description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <PieChart className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle className="text-xl mb-2">{settings.feature_3_title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {settings.feature_3_description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServerNewsletterProps {
  settings: SiteSettings;
}

export function ServerNewsletterSection({ settings }: ServerNewsletterProps) {
  return (
    <section id="newsletter" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {settings.newsletter_title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {settings.newsletter_description}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServerFooterProps {
  settings: SiteSettings;
}

export function ServerFooter({ settings }: ServerFooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {settings.site_logo_url ? (
                  <Image
                    src={settings.site_logo_url}
                    alt={settings.site_brand_name}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-lg">
                    {settings.site_brand_initials || settings.site_brand_name?.charAt(0) || 'B'}
                  </div>
                )}
                <span className="font-bold text-xl">{settings.site_brand_name}</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                {settings.site_description}
              </p>
              <div className="flex space-x-4">
                {settings.social_twitter && (
                  <Link href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                )}
                {settings.social_linkedin && (
                  <Link href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {settings.social_github && (
                  <Link href={settings.social_github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                )}
                {settings.social_email && (
                  <Link href={`mailto:${settings.social_email}`} className="text-gray-300 hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Categories removed from footer */}
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">
              © {currentYear} {settings.site_brand_name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
