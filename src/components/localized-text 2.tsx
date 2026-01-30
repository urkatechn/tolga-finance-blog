"use client";

import { useTranslation } from "@/contexts/language-context";

interface LocalizedTextProps {
    tKey: string;
    fallback?: string;
}

export function LocalizedText({ tKey, fallback }: LocalizedTextProps) {
    const { t } = useTranslation();
    const translated = t(tKey);

    // If translation key is not found (returns the key itself), show fallback
    if (translated === tKey && fallback) return <>{fallback}</>;

    return <>{translated}</>;
}
