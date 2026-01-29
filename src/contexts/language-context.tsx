"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "tr" | "en" | "de";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    tr: {
        "nav.home": "Ana Sayfa",
        "nav.blog": "Blog",
        "nav.services": "Hizmetler",
        "nav.about": "Hakkımda",
        "nav.contact": "İletişim",
        "nav.profile": "Profil",
        "nav.admin": "Admin Paneli",
        "nav.signin": "Giriş Yap",
        "nav.register": "Kayıt Ol",
        "auth.logout": "Çıkış",
        "hero.title": "Veriden Vizyona: Finansal Operasyonlarda Mükemmellik",
        "hero.subtitle_primary": "Stratejik planlama, operasyonel verimlilik ve veri odaklı kararlar ile işinizi geleceğe taşıyın.",
        "hero.subtitle_secondary": "Tolga Tanagardigil ile finansal süreçlerinizi optimize edin.",
        "hero.cta_primary": "Ücretsiz Danışmanlık",
        "hero.cta_secondary": "Hizmetlerimizi İnceleyin",
        "features.title": "Neden Bizimle Çalışmalısınız?",
        "features.subtitle": "Modern iş dünyasında fark yaratan stratejik yaklaşımlar",
        "feature.1.title": "Operasyonel Verimlilik",
        "feature.1.desc": "Süreçlerinizi analiz ediyor ve maksimum verimlilik için optimize ediyoruz.",
        "feature.2.title": "Finansal Strateji",
        "feature.2.desc": "Sadece bugünü değil, yarını da planlayan güçlü finansal modeller.",
        "feature.3.title": "Veri Analitiği",
        "feature.3.desc": "Rakamların ötesindeki hikayeyi görerek doğru kararlar almanızı sağlıyoruz.",
        "notification.title": "Bildirimler",
        "notification.empty": "Yeni bildirim yok",
        "notification.mark_as_read": "Okundu işaretle",
        "notification.view_admin": "Admin Paneli",
        "contact.response_time": "MAKSİMUM 24 SAAT DÖNÜŞ",
        "contact.commitment": "TAAHHÜTÜMÜZ",
        "about.professional_heritage": "MESLEKİ MİRAS",
        "about.professional_experiences": "MESLEKİ DENEYİMLER",
        "about.professional_summary": "MESLEKİ ÖZET",
        "about.key_statistics": "TEMEL İSTATİSTİKLER",
        "about.networking": "AĞ OLUŞTURMA",
        "about.engagement": "PROFESYONEL ETKİLEŞİM",
        "button.message": "Mesaj Gönder",
        "button.connect": "Bağlan",
        "button.send_email": "E-posta Gönder",
        "button.meeting_request": "Toplantı Talebi",
        "button.linkedin": "LinkedIn Bağlantısı"
    },
    en: {
        "nav.home": "Home",
        "nav.blog": "Blog",
        "nav.services": "Services",
        "nav.about": "About",
        "nav.contact": "Contact",
        "nav.profile": "Profile",
        "nav.admin": "Admin Portal",
        "nav.signin": "Sign In",
        "nav.register": "Register",
        "auth.logout": "Logout",
        "hero.title": "From Data to Vision: Operational Excellence",
        "hero.subtitle_primary": "Advance your business through strategic planning, operational efficiency, and data-driven decisions.",
        "hero.subtitle_secondary": "Optimize your financial processes with Tolga Tanagardigil.",
        "hero.cta_primary": "Free Consultation",
        "hero.cta_secondary": "Explore Services",
        "features.title": "Why Work With Us?",
        "features.subtitle": "Strategic approaches that make a difference in the modern business world",
        "feature.1.title": "Operational Efficiency",
        "feature.1.desc": "We analyze your processes and optimize them for maximum efficiency.",
        "feature.2.title": "Financial Strategy",
        "feature.2.desc": "Powerful financial models that plan not just for today, but for tomorrow.",
        "feature.3.title": "Data Analytics",
        "feature.3.desc": "We enable you to make the right decisions by seeing the story beyond the numbers.",
        "notification.title": "Recent Notifications",
        "notification.empty": "No recent activity",
        "notification.mark_as_read": "Mark as read",
        "notification.view_admin": "View Admin Portal",
        "contact.response_time": "MAXIMUM 24H RESPONSE TIME",
        "contact.commitment": "COMMITMENT",
        "about.professional_heritage": "PROFESSIONAL HERITAGE",
        "about.professional_experiences": "PROFESSIONAL EXPERIENCES",
        "about.professional_summary": "PROFESSIONAL SUMMARY",
        "about.key_statistics": "KEY STATISTICS",
        "about.networking": "NETWORKING",
        "about.engagement": "PROFESSIONAL ENGAGEMENT",
        "button.message": "Message",
        "button.connect": "Connect",
        "button.send_email": "Send E-mail",
        "button.meeting_request": "Meeting Request",
        "button.linkedin": "LinkedIn Connect"
    },
    de: {
        "nav.home": "Startseite",
        "nav.blog": "Blog",
        "nav.services": "Leistungen",
        "nav.about": "Über mich",
        "nav.contact": "Kontakt",
        "nav.profile": "Profil",
        "nav.admin": "Admin-Portal",
        "nav.signin": "Anmelden",
        "nav.register": "Registrieren",
        "auth.logout": "Abmelden",
        "hero.title": "Von Daten zur Vision: Operative Exzellenz",
        "hero.subtitle_primary": "Bringen Sie Ihr Unternehmen durch strategische Planung und datengesteuerte Entscheidungen voran.",
        "hero.subtitle_secondary": "Optimieren Sie Ihre Finanzprozesse mit Tolga Tanagardigil.",
        "hero.cta_primary": "Kostenlose Beratung",
        "hero.cta_secondary": "Leistungen ansehen",
        "features.title": "Warum mit uns arbeiten?",
        "features.subtitle": "Strategische Ansätze, die in der modernen Geschäftswelt den Unterschied machen",
        "feature.1.title": "Operative Effizienz",
        "feature.1.desc": "Wir analysieren Ihre Prozesse und optimieren sie für maximale Effizienz.",
        "feature.2.title": "Finanzstrategie",
        "feature.2.desc": "Leistungsstarke Finanzmodelle, die nicht nur für heute, sondern auch für morgen planen.",
        "feature.3.title": "Datenanalyse",
        "feature.3.desc": "Wir ermöglichen Ihnen die richtigen Entscheidungen, indem wir die Geschichte hinter den Zahlen sehen.",
        "notification.title": "Benachrichtigungen",
        "notification.empty": "Keine neuen Nachrichten",
        "notification.mark_as_read": "Als gelesen markieren",
        "notification.view_admin": "Admin-Bereich",
        "contact.response_time": "MAXIMAL 24H ANTWORTZEIT",
        "contact.commitment": "VERPFLICHTUNG",
        "about.professional_heritage": "BERUFLICHES ERBE",
        "about.professional_experiences": "BERUFLICHE ERFAHRUNGEN",
        "about.professional_summary": "ZUSAMMENFASSUNG",
        "about.key_statistics": "KERNSTATISTIKEN",
        "about.networking": "NETZWERK",
        "about.engagement": "PROFI-ENGAGEMENT",
        "button.message": "Nachricht",
        "button.connect": "Vernetzen",
        "button.send_email": "E-Mail senden",
        "button.meeting_request": "Terminanfrage",
        "button.linkedin": "LinkedIn-Verbindung"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("tr");

    useEffect(() => {
        const savedLang = localStorage.getItem("site-language") as Language;
        if (savedLang && (savedLang === "tr" || savedLang === "en" || savedLang === "de")) {
            setLanguageState(savedLang);
        } else {
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "de" || browserLang === "en") {
                setLanguageState(browserLang as Language);
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("site-language", lang);
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useTranslation must be used within a LanguageProvider");
    }
    return context;
}
