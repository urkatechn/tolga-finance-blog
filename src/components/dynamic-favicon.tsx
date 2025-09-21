"use client";

import { useSettings } from '@/contexts/settings-context';
import { useEffect } from 'react';

export function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings?.site_favicon_url) return;

    // Only manage our own favicon link to avoid interfering with Next.js head manager.
    const attr = 'data-app-favicon';
    let link = document.head.querySelector(`link[rel="icon"][${attr}]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute(attr, 'true');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // Update href (append timestamp to encourage refresh)
    link.href = `${settings.site_favicon_url}?v=${Date.now()}`;
  }, [settings?.site_favicon_url]);

  return null; // This component doesn't render anything
}
