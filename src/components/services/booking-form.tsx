"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Mail,
    User,
    Calendar,
    Clock,
    MessagesSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BookingForm({ googleMeetUrl }: { googleMeetUrl?: string }) {
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

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
            >
                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 ring-2 ring-green-100">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Request Sent</h3>
                <p className="text-slate-600 max-w-sm">
                    Thank you for your interest. You can already bookmark your meeting link:
                    <br />
                    <a href={googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline block mt-2 text-lg">
                        {googleMeetUrl}
                    </a>
                </p>
                <Button variant="outline" className="rounded-full h-12 px-8 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setSubmitted(false)}>
                    Send Another Request
                </Button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-slate-700">Name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="John Doe" className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-blue-500 transition-all rounded-xl text-slate-900" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-700">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="email" placeholder="john@company.com" className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-blue-500 transition-all rounded-xl text-slate-900" required />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-slate-700">Preferred Date</Label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="date" className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-blue-500 transition-all rounded-xl text-slate-900" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-700">Service Interest</Label>
                    <select className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 focus:border-blue-500 transition-all">
                        <option value="analysis" className="bg-white">Financial Analysis</option>
                        <option value="investment" className="bg-white">Investment Advisory</option>
                        <option value="wealth" className="bg-white">Wealth Management</option>
                        <option value="corporate" className="bg-white">Corporate Finance</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-slate-700">Brief Overview of Your Objectives</Label>
                <Textarea
                    placeholder="Tell us about your goals..."
                    className="min-h-[150px] bg-slate-50 border-slate-200 focus:border-blue-500 transition-all rounded-2xl p-4 text-slate-900"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-blue-900/10 text-white"
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
    );
}
