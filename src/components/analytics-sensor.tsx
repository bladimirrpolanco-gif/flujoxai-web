'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/metrics';

export function AnalyticsSensor() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if the path is different from the last tracked path
    if (pathname && pathname !== trackedPath.current) {
      trackedPath.current = pathname;
      trackEvent('visita', { path: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    // Helper to track all clicks on interactive elements like buttons and links
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = target.closest('button, a, [role="button"]') as HTMLElement;
      
      if (clickableElement) {
        // Try to find a meaningful name or CTA
        const ctaText = clickableElement.innerText || clickableElement.getAttribute('aria-label') || clickableElement.id || 'Boton/Enlace';
        const link = clickableElement.getAttribute('href');
        
        // If it is a WhatsApp link
        if (link && link.includes('wa.me')) {
          trackEvent('click_whatsapp', { url: link, cta: ctaText.trim() });
        } else {
          // Send generic CTA click
          trackEvent('click_cta', { 
            cta: ctaText.trim().substring(0, 50), 
            tag: clickableElement.tagName,
            href: link || undefined
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return null; // This component doesn't render anything
}
