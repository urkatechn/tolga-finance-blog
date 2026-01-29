import React from "react";
// @ts-nocheck
import * as Icons from "lucide-react";
import {
    ShieldCheck,
    Clock,
    ArrowRight,
    CheckCircle2,
    MessagesSquare,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { BookingForm } from "@/components/services/booking-form";
import { createClient } from "@/lib/supabase/server";
import { AdminServicesBar } from "@/components/services/admin-services-bar";
import { ServiceEditor } from "@/components/services/service-editor";

export default async function ServicesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === 'info@tolgatanagardigil.com';

    const settings = await getServerSettings();
    const dynamicServices = settings.services || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 selection:bg-slate-500/10">
            <ServerHeader settings={settings} transparent={false} />

            <main>
                {isAdmin && <AdminServicesBar services={dynamicServices} />}
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden bg-unified">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-slate-400/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium mb-6">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Corporate Excellence</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                                    Professional Services for <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-200 dark:via-slate-300 dark:to-slate-400">
                                        Strategic Growth
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                                    We provide world-class financial advisory and strategic consulting designed to empower decision-makers and secure long-term value.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-full text-white shadow-xl" asChild>
                                        <a href="#booking">
                                            Request Consultation <ArrowRight className="ml-2 w-5 h-5" />
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
                                        Our Methodology
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24 bg-slate-50/50 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dynamicServices.map((service: any, index: number) => {
                                const IconComponent = (Icons as any)[service.icon_name] || Icons.Briefcase;
                                return (
                                    <Card key={index} className="h-full bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                        {isAdmin && (
                                            <ServiceEditor
                                                service={service}
                                                index={index}
                                                allServices={dynamicServices}
                                            />
                                        )}
                                        <CardContent className="p-8">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 mb-6 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-500 ring-1 ring-slate-100 dark:ring-slate-700">
                                                <IconComponent className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                                {service.description}
                                            </p>
                                            <ul className="space-y-3">
                                                {(service.features || []).map((feature: string, fIndex: number) => (
                                                    <li key={fIndex} className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-500">
                                                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Booking Section */}
                <section id="booking" className="py-24 relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-blue-50/40 pointer-events-none" />
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side - Info */}
                                <div className="lg:w-2/5 p-8 md:p-12 lg:p-16 bg-slate-50 border-r border-slate-200">
                                    <h2 className="text-4xl font-black mb-6 text-slate-900">Let's Design Your Future</h2>
                                    <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                        Schedule a 30-minute introductory call to discuss your financial goals and how we can achieve them together.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm ring-1 ring-slate-200">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Duration</p>
                                                <p className="font-bold text-slate-900">30 Minutes Strategy Session</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm ring-1 ring-slate-200">
                                                <MessagesSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Meeting Link</p>
                                                <a href={settings.google_meet_url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                                                    Open Google Meet
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100 italic text-slate-700">
                                        "Our goal is not just to provide advice, but to engineer lasting success through strategic financial mastery."
                                    </div>
                                </div>

                                {/* Right Side - Form */}
                                <div className="lg:w-3/5 p-8 md:p-12 lg:p-16">
                                    <BookingForm googleMeetUrl={settings.google_meet_url} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ServerFooter settings={settings} />
        </div>
    );
}
