"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";

interface ClientNavigationProps {
    navigation: { name: string; href: string; target?: string }[];
    transparent?: boolean;
    hasUser: boolean;
}

export function ClientNavigation({ navigation, transparent, hasUser }: ClientNavigationProps) {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        target={item.target}
                        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                        className={cn(
                            "transition-all duration-300 font-medium",
                            transparent
                                ? isActive
                                    ? "text-white scale-110 drop-shadow-md"
                                    : "text-white/70 hover:text-white drop-shadow-sm"
                                : isActive
                                    ? "text-blue-600 font-bold"
                                    : "text-slate-600 hover:text-blue-600"
                        )}
                    >
                        {item.name}
                        {isActive && !transparent && (
                            <span className="block h-0.5 bg-blue-600 scale-x-100 transition-transform duration-300" />
                        )}
                    </Link>
                );
            })}
            {hasUser && (
                <LogoutButton
                    variant={transparent ? "ghost" : "ghost"}
                    className={cn(
                        "transition-colors",
                        transparent ? "text-white hover:text-white" : ""
                    )}
                />
            )}
        </nav>
    );
}
