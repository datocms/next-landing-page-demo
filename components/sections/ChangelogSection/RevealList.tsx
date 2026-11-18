'use client';

import { type ReactNode, useEffect, useRef } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * An <ol> whose [data-reveal] children settle in once as they enter the view
 * (the styles are motion.module.css's .item). Only the children still below the
 * fold when the page loads are held back, so nothing on screen blinks; without
 * JavaScript, or under reduced motion, every child simply shows
 */
const RevealList = ({ className, children }: Props) => {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (
      !list ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const fold = window.innerHeight * 0.9;
    const waiting = Array.from(
      list.querySelectorAll<HTMLElement>('[data-reveal]'),
    ).filter((item) => item.getBoundingClientRect().top > fold);
    if (waiting.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'in';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    for (const item of waiting) {
      item.dataset.reveal = 'waiting';
      observer.observe(item);
    }
    return () => {
      observer.disconnect();
      for (const item of waiting) item.dataset.reveal = 'in';
    };
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
};

export default RevealList;
