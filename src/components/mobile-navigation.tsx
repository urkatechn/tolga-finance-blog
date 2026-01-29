"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { LanguageSwitcher } from "@/components/nav/language-switcher";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  navigation: { name: string; href: string }[];
  showLogout?: boolean;
}

export function MobileNavigation({ navigation, showLogout }: MobileNavigationProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open main menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="md:hidden w-[260px] sm:w-[320px]">
        <nav className="mt-8 flex flex-col space-y-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const translationKey = `nav.${item.name.toLowerCase().replace(/\s+/g, '')}`;
            const translatedName = t(translationKey);

            return (
              <SheetClose asChild key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {translatedName !== translationKey ? translatedName : item.name}
                </Link>
              </SheetClose>
            );
          })}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {showLogout && (
              <LogoutButton
                variant="outline"
                className="w-full justify-start"
              />
            )}

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Language:</span>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
