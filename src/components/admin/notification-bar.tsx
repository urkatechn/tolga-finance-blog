"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, X, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function AdminNotificationBar({ userEmail }: { userEmail: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const isAdmin = userEmail === "info@tolgatanagardigil.com";
    const supabase = createClient();

    useEffect(() => {
        if (!isAdmin) return;

        // Initial fetch of unread notifications
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("is_read", false)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setNotifications(data);
            }
        };

        fetchNotifications();

        // Subscribe to new notifications
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
                    setNotifications((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAdmin, supabase]);

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);

        if (!error) {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
    };

    const markAllAsRead = async () => {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("is_read", false);

        if (!error) {
            setNotifications([]);
        }
    };

    if (!isAdmin || notifications.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4"
            >
                <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-xl bg-slate-900/90 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                            <Bell className="w-5 h-5 animate-bounce" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-0.5">Admin Notification</p>
                            <h4 className="text-sm font-bold text-white leading-tight">
                                {notifications.length} New {notifications.length > 1 ? "Notifications" : "Notification"}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                                {notifications[0].title}: {notifications[0].message}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 text-slate-400 hover:text-white"
                            onClick={markAllAsRead}
                        >
                            Clear All
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                            asChild
                        >
                            <a href="/admin">Portal</a>
                        </Button>
                        <button
                            onClick={() => markAsRead(notifications[0].id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
