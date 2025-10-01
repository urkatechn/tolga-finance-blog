"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  Settings, 
  Upload, 
  MessageSquare,
  Users,
  Globe,
  Palette,
  User,
  ChevronDown,
  UserCircle,
  BookOpen,
} from "lucide-react";
import React, { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/admin/user-menu";
import { useSettings } from '@/contexts/settings-context';
import { SidebarHeaderSkeleton } from "@/components/admin/sidebar-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface SubNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Upload,
  },
  {
    title: "Subscribers",
    href: "/admin/subscribers",
    icon: Users,
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      {
        title: "General",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Blog",
        href: "/admin/settings/blog",
        icon: BookOpen,
      },
      {
        title: "Branding",
        href: "/admin/settings/branding",
        icon: Palette,
      },
      {
        title: "Social",
        href: "/admin/settings/social",
        icon: Globe,
      },
      {
        title: "Authors",
        href: "/admin/settings/authors",
        icon: User,
      },
      {
        title: "About Me",
        href: "/admin/settings/aboutme",
        icon: UserCircle,
      },
      {
        title: "Contact",
        href: "/admin/settings/contact",
        icon: MessageSquare,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { settings, loading } = useSettings();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Auto-open submenu if current path matches a sub-item
  React.useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => pathname === subItem.href);
        if (hasActiveSubItem) {
          setOpenSubMenus(prev => ({ ...prev, [item.title]: true }));
        }
      }
    });
  }, [pathname]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {loading ? (
          <SidebarHeaderSkeleton />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {settings?.site_logo_url ? (
                      <img 
                        src={settings.site_logo_url} 
                        alt="Logo" 
                        className="size-6 object-contain"
                      />
                    ) : settings?.site_brand_initials ? (
                      <span className="text-xs font-bold">
                        {settings.site_brand_initials}
                      </span>
                    ) : (
                      <LayoutDashboard className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {settings?.site_brand_name || 'Finance Blog'}
                    </span>
                    <span className="truncate text-xs">Admin Panel</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.subItems) {
                  // Handle items with sub-items
                  const isOpen = openSubMenus[item.title];
                  const hasActiveSubItem = item.subItems.some(subItem => pathname === subItem.href);
                  
                  // While settings are loading, show skeletons for the Settings menu and its sub-items
                  if (item.title === 'Settings' && loading) {
                    return (
                      <SidebarMenuItem key="settings-skeleton">
                        <SidebarMenuSkeleton />
                        <SidebarMenuSub>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <SidebarMenuSubItem key={idx}>
                              <div className="flex items-center gap-2 px-2 py-1.5">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-3 w-28" />
                              </div>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleSubMenu(item.title)}
                        isActive={hasActiveSubItem}
                        tooltip={item.title}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        <ChevronDown 
                          className={`ml-auto size-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`} 
                        />
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'BETA' ? 'secondary' : 'outline'} 
                            className="text-xs px-1.5 py-0.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                      {isOpen && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link href={subItem.href}>
                                    <subItem.icon className="size-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                } else {
                  // Handle regular items without sub-items
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href!}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href!}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === 'BETA' ? 'secondary' : 'outline'} 
                              className="ml-auto text-xs px-1.5 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
