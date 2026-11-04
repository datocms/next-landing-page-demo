import { type KeyboardEvent, useCallback, useState } from 'react';

/**
 * One-at-a-time testimonial state: wraps around, never autoplays, and lets
 * ArrowLeft/ArrowRight change slides while focus is on the carousel controls.
 * `hasInteracted` turns on the polite announcement only after the first change,
 * so nothing is read out on page load.
 */
export function useCarousel(count: number) {
  const [rawIndex, setIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Real-time updates can shrink the list under us
  const activeIndex = count > 0 ? Math.min(rawIndex, count - 1) : 0;

  const next = useCallback(() => {
    if (count < 2) return;
    setHasInteracted(true);
    setIndex((current) => (Math.min(current, count - 1) + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count < 2) return;
    setHasInteracted(true);
    setIndex((current) => (Math.min(current, count - 1) - 1 + count) % count);
  }, [count]);

  const goTo = useCallback(
    (target: number) => {
      if (count < 2) return;
      setHasInteracted(true);
      setIndex(((target % count) + count) % count);
    },
    [count],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (count < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      const target = event.target as HTMLElement;
      // Leave arrow keys alone inside form fields, and inside a slide: changing
      // slides there would make the focused element inert and drop focus. A
      // slide is matched by its role, as its roledescription is translated
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="group"][aria-roledescription]',
        )
      ) {
        return;
      }

      event.preventDefault();
      const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const forward = (event.key === 'ArrowRight') !== isRtl;
      if (forward) {
        next();
      } else {
        prev();
      }
    },
    [count, next, prev],
  );

  return { activeIndex, hasInteracted, next, prev, goTo, onKeyDown };
}
