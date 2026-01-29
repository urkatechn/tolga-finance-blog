"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, X, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/language-context";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function NotificationBell({ userEmail, transparent }: { userEmail: string; transparent?: boolean }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const isAdmin = userEmail === "info@tolgatanagardigil.com";
    const supabase = createClient();

    useEffect(() => {
        if (!isAdmin) return;

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            if (!error && data) {
                setNotifications(data);
            }
        };

        fetchNotifications();

        const channel = supabase
            .channel("admin-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                (payload: { new: Notification }) => {
                    setNotifications((prev) => [payload.new, ...prev.slice(0, 4)]);
                    setIsOpen(true);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAdmin, supabase]);

    if (!isAdmin) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);

        if (!error) {
            setNotifications((prev) =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-full transition-all border shadow-sm",
                    transparent
                        ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 10, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 10, opacity: 0, scale: 0.95 }}
                        className="absolute top-full mt-4 right-0 z-[100] w-[320px]"
                    >
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{t("notification.title")}</h4>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <Info className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-medium">{t("notification.empty")}</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group ${!n.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                            {!n.is_read && <div className="absolute top-4 left-2 w-1 h-1 rounded-full bg-blue-600" />}
                                            <div className="pl-3">
                                                <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">{n.title}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">{n.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-slate-400 font-medium">
                                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {!n.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(n.id)}
                                                            className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            {t("notification.mark_as_read")}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <a href="/admin" className="block p-3 text-center text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-t border-slate-100 dark:border-slate-800">
                                {t("notification.view_admin")}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Minimal helper to fix missing import
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
