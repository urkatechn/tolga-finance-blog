"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Target,
    LineChart,
    ShieldCheck,
    Users2,
    Briefcase,
    Calendar,
    Clock,
    ArrowRight,
    CheckCircle2,
    Mail,
    User,
    MessagesSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/settings-context";
import { ServerHeader, ServerFooter } from "@/components/server-layout";

const services = [
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: "Financial Analysis & Planning",
        description: "Deep-dive analysis of your current financial standing with data-driven projections for future growth and stability.",
        features: ["Cash Flow Management", "Budget Optimization", "Retirement Planning"]
    },
    {
        icon: <Target className="w-8 h-8" />,
        title: "Strategic Investment Advisory",
        description: "Customized investment strategies aligned with your risk tolerance and long-term financial objectives.",
        features: ["Portfolio Diversification", "Market Analysis", "Risk Assessment"]
    },
    {
        icon: <LineChart className="w-8 h-8" />,
        title: "Wealth Management",
        description: "Comprehensive wealth preservation and growth strategies designed for individuals and corporate entities.",
        features: ["Estate Planning", "Asset Protection", "Tax Optimization"]
    },
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Risk & Compliance",
        description: "Ensuring your financial operations meet all regulatory requirements while minimizing institutional risks.",
        features: ["Regulatory Audits", "Internal Controls", "Compliance Roadmaps"]
    },
    {
        icon: <Users2 className="w-8 h-8" />,
        title: "Corporate Finance",
        description: "Strategic advisory for business expansion, mergers, acquisitions, and capital structure optimization.",
        features: ["M&A Advisory", "Capital Raising", "Business Valuation"]
    },
    {
        icon: <Briefcase className="w-8 h-8" />,
        title: "Exclusive Consulting",
        description: "One-on-one executive consulting for high-stakes financial decisions and complex economic challenges.",
        features: ["Executive Coaching", "Strategic Workshops", "Crisis Management"]
    }
];

export default function ServicesPage() {
    const { settings } = useSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {settings && <ServerHeader settings={settings} transparent={false} />}

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full opacity-30 pointer-events-none" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Excellence Through Precision</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
                                    Strategic Services for <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                        Sustainable Success
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                                    We provide world-class financial advisory and strategic consulting designed to empower decision-makers and secure long-term value.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 rounded-full" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                                        Book a Consultation <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-700 text-white hover:bg-white/5">
                                        Our Methodology
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24 bg-slate-900/50 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        visible: {
                                            opacity: 1,
                                            scale: 1,
                                            transition: { delay: index * 0.1, duration: 0.5 }
                                        }
                                    }}
                                >
                                    <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-500 group">
                                        <CardContent className="p-8">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-500 ring-1 ring-blue-500/20">
                                                {service.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-slate-400 mb-6 leading-relaxed">
                                                {service.description}
                                            </p>
                                            <ul className="space-y-3">
                                                {service.features.map((feature, fIndex) => (
                                                    <li key={fIndex} className="flex items-center gap-3 text-sm text-slate-300">
                                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Booking Section */}
                <section id="booking" className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side - Info */}
                                <div className="lg:w-2/5 p-8 md:p-12 lg:p-16 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-r border-white/5">
                                    <h2 className="text-4xl font-black mb-6">Let's Design Your Future</h2>
                                    <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                                        Schedule a 30-minute introductory call to discuss your financial goals and how we can achieve them together.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/30">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400">Duration</p>
                                                <p className="font-bold text-white">30 Minutes Strategy Session</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/30">
                                                <MessagesSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400">Delivery</p>
                                                <p className="font-bold text-white">Virtual or In-Person (London/Istanbul)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 italic text-slate-300">
                                        "Our goal is not just to provide advice, but to engineer lasting success through strategic financial mastery."
                                    </div>
                                </div>

                                {/* Right Side - Form */}
                                <div className="lg:w-3/5 p-8 md:p-12 lg:p-16">
                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-center space-y-6"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 ring-2 ring-green-500/20">
                                                <CheckCircle2 className="w-12 h-12" />
                                            </div>
                                            <h3 className="text-3xl font-bold">Request Sent</h3>
                                            <p className="text-slate-400 max-w-sm">
                                                Thank you for your interest. Our team will review your request and send a meeting invitation within 24 hours.
                                            </p>
                                            <Button variant="outline" className="rounded-full h-12 px-8" onClick={() => setSubmitted(false)}>
                                                Send Another Request
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input placeholder="John Doe" className="pl-12 h-14 bg-white/5 border-slate-700 focus:border-blue-500 transition-all rounded-xl" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input type="email" placeholder="john@company.com" className="pl-12 h-14 bg-white/5 border-slate-700 focus:border-blue-500 transition-all rounded-xl" required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Preferred Date</Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <Input type="date" className="pl-12 h-14 bg-white/5 border-slate-700 focus:border-blue-500 transition-all rounded-xl" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Service Interest</Label>
                                                    <select className="flex h-14 w-full rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white focus:border-blue-500 transition-all">
                                                        <option value="analysis" className="bg-slate-900">Financial Analysis</option>
                                                        <option value="investment" className="bg-slate-900">Investment Advisory</option>
                                                        <option value="wealth" className="bg-slate-900">Wealth Management</option>
                                                        <option value="corporate" className="bg-slate-900">Corporate Finance</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Brief Overview of Your Objectives</Label>
                                                <Textarea
                                                    placeholder="Tell us about your goals..."
                                                    className="min-h-[150px] bg-white/5 border-slate-700 focus:border-blue-500 transition-all rounded-2xl p-4"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-blue-900/20"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    "Request Meeting Invitation"
                                                )}
                                            </Button>
                                            <p className="text-center text-xs text-slate-500">
                                                By submitting, you agree to our confidential management of your data.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {settings && <ServerFooter settings={settings} />}
        </div>
    );
}
