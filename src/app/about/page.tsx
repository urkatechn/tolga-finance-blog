import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Coffee, 
  BookOpen, 
  TrendingUp, 
  Heart,
  Mail,
  Linkedin
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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

export default function AboutPage() {
  const personalStats = [
    { label: "Years Investing", value: "12+", icon: TrendingUp },
    { label: "Articles Written", value: "150+", icon: BookOpen },
    { label: "Coffee Consumed", value: "∞", icon: Coffee },
  ];

  const journey = [
    {
      year: "2012",
      title: "First Investment",
      description: "Made my first stock purchase with $500 from my summer job. Lost 30% in the first month - learned my first lesson about research!"
    },
    {
      year: "2015",
      title: "The Learning Phase",
      description: "Spent countless hours reading financial books, following market news, and making plenty of mistakes along the way."
    },
    {
      year: "2018",
      title: "Finding My Strategy",
      description: "Developed a disciplined approach to investing focused on long-term value and diversification."
    },
    {
      year: "2021",
      title: "Started Writing",
      description: "Began sharing my experiences and insights to help others avoid the mistakes I made early on."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white mb-2">
                Hey, I&apos;m
              </span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                Your Finance Friend
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Just someone who made a lot of financial mistakes so you don&apos;t have to. Here&apos;s my story.
            </p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                My Financial Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Like most people, I learned about money the hard way. Here&apos;s how I went from financial disasters to (hopefully) helpful insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Reality Check
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  I started investing in 2012 with zero knowledge and maximum confidence. Spoiler alert: it didn&apos;t go well. 
                  That first 30% loss taught me more than any textbook ever could.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  After years of mistakes, research, and slowly figuring things out, I realized that most financial advice 
                  is either too complex or too generic. So I started writing about what actually works in real life.
                </p>
              </div>
              
              <div className="space-y-6">
                {journey.map((item, index) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What I Actually Write About
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No fluff, no get-rich-quick schemes. Just practical stuff that actually matters.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl">Investing Reality</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    Real talk about building wealth through investing. No day trading nonsense, just long-term strategies that work.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Portfolio Building</Badge>
                    <Badge variant="secondary">Risk Management</Badge>
                    <Badge variant="secondary">Market Psychology</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <Heart className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-xl">Money & Life</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    How to handle money without it taking over your life. Budgeting, saving, and financial planning that actually sticks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Emergency Funds</Badge>
                    <Badge variant="secondary">Debt Freedom</Badge>
                    <Badge variant="secondary">Financial Goals</Badge>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Let&apos;s Connect
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Got questions? Want to share your own financial wins or disasters? I&apos;d love to hear from you.
            </p>
            
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
              <p className="text-gray-700 dark:text-gray-300 italic">
                &quot;The best investment advice I ever got was from someone who admitted their mistakes. 
                That&apos;s what I try to do here - share what works, what doesn&apos;t, and what I learned along the way.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Join the Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Get my latest thoughts on investing, money, and life delivered weekly. No spam, just honest insights.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
