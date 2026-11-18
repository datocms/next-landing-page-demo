'use client';

import { useEffect } from 'react';

/** How long after its reveal starts an element hands back its own transitions */
const SETTLED_AFTER_MS = 2200;
/** Items entering together are staggered by this much, up to STAGGER_MAX steps */
const STAGGER_MS = 60;
const STAGGER_MAX = 6;

/**
 * The page's motion driver, mounted once (in the header). It renders nothing.
 *
 * Reveal: every `.reveal` element that is still below the fold once the page has
 * loaded is marked `data-reveal="waiting"` (styles/motion.css hides it a few
 * pixels low) and watched by one IntersectionObserver; as it enters the view it
 * turns `in` and settles, staggered with whatever enters alongside it. Content
 * already on screen is never touched, so nothing blinks; without JavaScript, and
 * under reduced motion, nothing is ever marked, so everything simply shows.
 *
 * Loops: every `.loop` element (the breathing rings, the floating hero cards)
 * gets `data-offscreen` while it is out of view, which pauses its animation.
 *
 * New content (a client navigation, a streamed section) is picked up by a
 * MutationObserver, batched to one scan per frame.
 */
const MotionObserver = () => {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const seen = new WeakSet<Element>();
    const waiting = new Set<HTMLElement>();
    const timers = new Set<number>();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const settle = (element: HTMLElement) => {
      delete element.dataset.reveal;
      element.style.removeProperty('--reveal-delay');
    };

    const reveal = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        entering.forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          reveal.unobserve(element);
          waiting.delete(element);
          const delay = Math.min(index, STAGGER_MAX) * STAGGER_MS;
          element.style.setProperty('--reveal-delay', `${delay}ms`);
          element.dataset.reveal = 'in';
          const timer = window.setTimeout(() => {
            timers.delete(timer);
            settle(element);
          }, delay + SETTLED_AFTER_MS);
          timers.add(timer);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const loops = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
        }
      },
      { rootMargin: '120px 0px' },
    );

    const scan = () => {
      const fold = window.innerHeight;
      for (const element of document.querySelectorAll<HTMLElement>(
        '.reveal, .loop',
      )) {
        if (seen.has(element)) continue;
        seen.add(element);
        if (element.classList.contains('loop')) loops.observe(element);
        if (!element.classList.contains('reveal') || reduced.matches) continue;
        // Anything whose top is already on screen (or above it) stays as it is
        if (element.getBoundingClientRect().top < fold) continue;
        element.dataset.reveal = 'waiting';
        waiting.add(element);
        reveal.observe(element);
      }
    };

    let frame = 0;
    const scheduleScan = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    };

    scan();
    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Switching to reduced motion mid-visit: show whatever is still waiting
    const onReducedChange = () => {
      if (!reduced.matches) return;
      for (const element of waiting) {
        reveal.unobserve(element);
        settle(element);
      }
      waiting.clear();
    };
    reduced.addEventListener('change', onReducedChange);

    return () => {
      window.cancelAnimationFrame(frame);
      mutations.disconnect();
      reveal.disconnect();
      loops.disconnect();
      reduced.removeEventListener('change', onReducedChange);
      for (const timer of timers) window.clearTimeout(timer);
      for (const element of waiting) settle(element);
      for (const element of document.querySelectorAll<HTMLElement>(
        '[data-reveal]',
      )) {
        settle(element);
      }
    };
  }, []);

  return null;
};

export default MotionObserver;
