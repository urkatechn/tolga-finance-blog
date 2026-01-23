"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

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
                  {item.name}
                </Link>
              </SheetClose>
            );
          })}
          {showLogout && (
            <LogoutButton
              variant="outline"
              className="mt-4 w-full justify-start"
            />
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
