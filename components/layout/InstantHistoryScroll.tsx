'use client';

import { useEffect } from 'react';

/**
 * Back and Forward land on the restored scroll position in one jump. The
 * browser's restoration would otherwise follow the page's smooth scrolling
 * (meant for in-page links) and glide. Smooth scrolling is switched off for
 * half a second after each history navigation. Renders nothing.
 */
export default function InstantHistoryScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const onPopState = () => {
      root.style.scrollBehavior = 'auto';
      setTimeout(() => root.style.removeProperty('scroll-behavior'), 500);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}
