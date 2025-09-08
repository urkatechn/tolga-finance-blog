"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");
  };

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            Welcome aboard! 🎉
          </h3>
          <p className="text-green-700 dark:text-green-300">
            You&apos;ll receive our latest financial insights and market analysis directly in your inbox.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
          Stay Updated with Financial Insights
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Get weekly market analysis, investment tips, and financial strategies delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !email}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
