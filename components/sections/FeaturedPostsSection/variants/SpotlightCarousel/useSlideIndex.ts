import { useLayoutEffect, useRef, useState } from 'react';

/**
 * The active slide out of `count`, stepped with wrap-around. Attach
 * `slidesRef` to the element holding the slides: when a step starts with focus
 * inside it, focus moves to the incoming slide's title link (marked
 * `data-slide-title`), since the outgoing slide turns inert and would drop
 * focus to <body>.
 */
export default function useSlideIndex(count: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  // Set when a slide change starts while focus is inside the outgoing slide
  const refocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!refocusRef.current || count === 0) {
      return;
    }
    refocusRef.current = false;
    slidesRef.current?.children[currentIndex % count]
      ?.querySelector<HTMLElement>('[data-slide-title]')
      ?.focus({ preventScroll: true });
  }, [currentIndex, count]);

  const step = (delta: number) => {
    if (count < 2) {
      return;
    }
    refocusRef.current =
      slidesRef.current?.contains(document.activeElement) ?? false;
    setHasInteracted(true);
    setCurrentIndex(
      (prev) => ((((prev % count) + delta) % count) + count) % count,
    );
  };

  return {
    // The modulo keeps the index in range if the post list shrinks
    activeIndex: count > 0 ? currentIndex % count : 0,
    /** False until the first step, so the live region stays quiet on load */
    hasInteracted,
    slidesRef,
    /** Moves by `delta` slides (+1 next, -1 previous) */
    step,
  };
}
