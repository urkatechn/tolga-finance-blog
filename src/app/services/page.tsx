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
import { ServiceEditor } from "../../components/services/service-editor";
import { LocalizedText } from "@/components/localized-text";

export default async function ServicesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === 'info@tolgatanagardigil.com';

    const settings = await getServerSettings();
    const dynamicServices = settings.services || [];

    return (
        <div className="min-h-screen bg-unified selection:bg-slate-500/10">
            <ServerHeader settings={settings} transparent={false} />

            <main>
                {isAdmin && <AdminServicesBar services={dynamicServices} />}

                {/* Hero Section - Elite Branding */}
                <section className="relative pt-40 pb-24 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-slate-400/5 blur-[150px] rounded-full opacity-40 pointer-events-none" />
                    <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span><LocalizedText tKey="services.hero_badge" fallback="Financial and Operational Process Advisory" /></span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-slate-900 dark:text-white drop-shadow-sm">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-500">
                                    <LocalizedText tKey="services.hero_title" fallback="Financial Future Matters!" />
                                </span>
                            </h1>

                            <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                                <LocalizedText tKey="services.hero_subtitle" fallback="Customized high-stakes financial architecture designed for elite decision-makers who demand operational precision and strategic mastery." />
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                <Button size="lg" className="h-16 px-10 text-base font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-2xl text-white shadow-2xl transition-all hover:scale-105 active:scale-95" asChild>
                                    <a href="#booking">
                                        <LocalizedText tKey="services.button_booking" fallback="Executive Booking" /> <ArrowRight className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                                <Button variant="outline" size="lg" className="h-16 px-10 text-base font-bold rounded-2xl border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all hover:scale-105 backdrop-blur-sm">
                                    <LocalizedText tKey="services.button_methodology" fallback="Methodology" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid - Premium Gallery */}
                <section className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {dynamicServices.map((service: any, index: number) => {
                                const IconComponent = (Icons as any)[service.icon_name] || Icons.Briefcase;
                                return (
                                    <div key={index} className="group relative">
                                        <Card className="h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-700 overflow-hidden rounded-[32px] hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                                            {isAdmin && (
                                                <ServiceEditor
                                                    service={service}
                                                    index={index}
                                                    allServices={dynamicServices}
                                                />
                                            )}
                                            <CardContent className="p-10">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-900 dark:text-white mb-8 group-hover:scale-110 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-500 shadow-inner">
                                                    <IconComponent className="w-7 h-7" />
                                                </div>

                                                <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white tracking-tight leading-tight">
                                                    <LocalizedText tKey={service.title} fallback={service.title} />
                                                </h3>

                                                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm font-medium">
                                                    <LocalizedText tKey={service.description} fallback={service.description} />
                                                </p>

                                                <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-8">
                                                    {(service.features || []).map((feature: string, fIndex: number) => (
                                                        <div key={fIndex} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Corner Accent */}
                                        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-slate-200/0 to-slate-200/5 dark:to-slate-800/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Booking Section - Private Advisory */}
                <section id="booking" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="max-w-7xl mx-auto rounded-[48px] overflow-hidden bg-slate-900 dark:bg-slate-950 shadow-3xl border border-slate-800">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side - Elite Branding */}
                                <div className="lg:w-[45%] p-10 md:p-16 lg:p-20 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white">
                                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]" />

                                    <div className="relative z-10">
                                        <div className="w-12 h-1 px-0 bg-white/20 mb-10" />
                                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter">
                                            <LocalizedText tKey="services.booking_title" fallback="Initiate Strategic Advisory" />
                                        </h2>
                                        <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">
                                            <LocalizedText tKey="services.booking_desc" fallback="The first step toward institutional excellence begins with a private consultation to establish your strategic objectives." />
                                        </p>

                                        <div className="space-y-8">
                                            <div className="flex items-start gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xl backdrop-blur-md">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1"><LocalizedText tKey="services.booking_time_label" fallback="Timeframe" /></p>
                                                    <p className="text-base font-bold text-white"><LocalizedText tKey="services.booking_time_value" fallback="30-Min Executive Review" /></p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xl backdrop-blur-md">
                                                    <MessagesSquare className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1"><LocalizedText tKey="services.booking_channel_label" fallback="Secure Channel" /></p>
                                                    <a href={settings.google_meet_url} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                                                        <LocalizedText tKey="services.booking_channel_value" fallback="Google Meet Infrastructure" /> <ArrowRight className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-20 py-8 px-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                            <p className="italic text-slate-300 text-sm leading-relaxed font-medium">
                                                "<LocalizedText tKey="services.booking_quote" fallback="We do not merely advise; we architect paths to absolute financial dominance through rigorous analysis and strategic foresight." />"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Secure Form */}
                                <div className="lg:w-[55%] p-10 md:p-16 lg:p-20 bg-white dark:bg-slate-900/50">
                                    <div className="max-w-md mx-auto">
                                        <div className="mb-10">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2"><LocalizedText tKey="services.form_title" fallback="Registration" /></h3>
                                            <p className="text-slate-500 text-sm font-medium"><LocalizedText tKey="services.form_desc" fallback="Provide your contact details to begin the engagement." /></p>
                                        </div>
                                        <BookingForm googleMeetUrl={settings.google_meet_url} />
                                    </div>
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
