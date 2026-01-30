"use client";

import { useTranslation, Language } from "@/contexts/language-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages: { code: Language; label: string; flag: string }[] = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSwitcher({ transparent }: { transparent?: boolean }) {
    const { language, setLanguage } = useTranslation();

    const currentLang = languages.find((l) => l.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-9 px-3 gap-2 rounded-full border transition-all",
                        transparent
                            ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                >
                    <Globe className="w-4 h-4 opacity-70" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{currentLang?.code}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px] rounded-xl p-1 shadow-2xl border-slate-200 dark:border-slate-800">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                            language === lang.code
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-base leading-none">{lang.flag}</span>
                            <span className="text-xs font-medium">{lang.label}</span>
                        </div>
                        {language === lang.code && <Check className="w-4 h-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
