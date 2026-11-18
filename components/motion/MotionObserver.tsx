'use client';

import { useEffect } from 'react';

/**
 * Pauses the page's slow loops while they are off screen. Mounted once (in the
 * header); it renders nothing.
 *
 * Every `.loop` element (the breathing rings, the floating hero cards) gets
 * `data-offscreen` while it is out of view, which pauses its animation
 * (styles/motion.css). Nothing is ever hidden: content does not wait for
 * scrolling, so it is always there for readers and for visual editing.
 *
 * New content (a client navigation, a streamed section) is picked up by a
 * MutationObserver, batched to one scan per frame.
 */
const MotionObserver = () => {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const seen = new WeakSet<Element>();

    const loops = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
        }
      },
      { rootMargin: '120px 0px' },
    );

    const scan = () => {
      for (const element of document.querySelectorAll('.loop')) {
        if (seen.has(element)) continue;
        seen.add(element);
        loops.observe(element);
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

    return () => {
      window.cancelAnimationFrame(frame);
      mutations.disconnect();
      loops.disconnect();
    };
  }, []);

  return null;
};

export default MotionObserver;
