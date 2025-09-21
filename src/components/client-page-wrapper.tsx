"use client";

import { useSettings } from "@/contexts/settings-context";
import { TrendingUp, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientPageWrapperProps {
  children: React.ReactNode;
}

export function ClientPageWrapper({ children }: ClientPageWrapperProps) {
  return children;
}

export function DynamicFeaturesSection() {
  const { settings } = useSettings();
  
  // Use settings with fallbacks
  const sectionTitle = settings?.landing_section_title || "What You'll Find Here";
  const sectionSubtitle = settings?.landing_section_subtitle || "Real financial advice from someone who has made the mistakes so you do not have to";
  
  const feature1Title = settings?.feature_1_title || "Honest Investing";
  const feature1Description = settings?.feature_1_description || "No get-rich-quick schemes. Just real strategies for building wealth over time, including the mistakes I made along the way.";
  
  const feature2Title = settings?.feature_2_title || "Money That Works";
  const feature2Description = settings?.feature_2_description || "Practical budgeting, saving, and debt strategies that actually fit into real life. No perfect spreadsheets required.";
  
  const feature3Title = settings?.feature_3_title || "Simple Portfolios";
  const feature3Description = settings?.feature_3_description || "Build diversified portfolios without the complexity. Learn what works and what doesn't from 12+ years of trial and error.";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionTitle}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                <CardTitle className="text-xl mb-2">{feature1Title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature1Description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-600 mb-4" />
                <CardTitle className="text-xl mb-2">{feature2Title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature2Description}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <PieChart className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle className="text-xl mb-2">{feature3Title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature3Description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DynamicNewsletterSection({ children }: { children?: React.ReactNode }) {
  const { settings } = useSettings();
  
  const newsletterTitle = settings?.newsletter_title || "Join the Journey";
  const newsletterDescription = settings?.newsletter_description || "Get my latest thoughts on investing, money, and life delivered weekly. No spam, no sales pitches - just honest insights from someone still figuring it out.";

  return (
    <section id="newsletter" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {newsletterTitle}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {newsletterDescription}
            </p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
