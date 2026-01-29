"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";
import { useTranslation } from "@/contexts/language-context";
import { NotificationBell } from "@/components/nav/notification-bell";
import { LanguageSwitcher } from "@/components/nav/language-switcher";

interface ClientNavigationProps {
    navigation: { name: string; href: string; target?: string }[];
    transparent?: boolean;
    hasUser: boolean;
    userEmail?: string;
}

export function ClientNavigation({ navigation, transparent, hasUser, userEmail }: ClientNavigationProps) {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <nav className="hidden md:flex items-center space-x-6">
            {/* Notification Bell (Left of Home) */}
            {hasUser && userEmail && (
                <div className="mr-2">
                    <NotificationBell userEmail={userEmail} transparent={transparent} />
                </div>
            )}

            {navigation.map((item) => {
                const isActive = pathname === item.href;
                // Map navigation names to translation keys
                const translationKey = `nav.${item.name.toLowerCase().replace(/\s+/g, '')}`;
                const translatedName = t(translationKey);

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        target={item.target}
                        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                        className={cn(
                            "transition-all duration-300 font-medium text-sm",
                            item.name === "Register"
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-full hover:scale-105 shadow-md ml-4"
                                : transparent
                                    ? isActive
                                        ? "text-white scale-110 drop-shadow-md"
                                        : "text-white/70 hover:text-white drop-shadow-sm"
                                    : isActive
                                        ? "text-slate-900 font-bold"
                                        : "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        {translatedName !== translationKey ? translatedName : item.name}
                        {isActive && !transparent && item.name !== "Register" && (
                            <span className="block h-0.5 bg-slate-900 scale-x-100 transition-transform duration-300" />
                        )}
                    </Link>
                );
            })}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                {hasUser && (
                    <LogoutButton
                        variant={transparent ? "ghost" : "ghost"}
                        className={cn(
                            "transition-colors h-9",
                            transparent ? "text-white hover:text-white" : ""
                        )}
                    />
                )}

                {/* Language Switcher (Right of Logout) */}
                <LanguageSwitcher transparent={transparent} />
            </div>
        </nav>
    );
}
