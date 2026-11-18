'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  items: { id: string; text: string }[];
  /**
   * `rail` (the docs): the links hang on a hairline, and a 2px accent marker
   * glides along it to the section being read. Without it, only the colour changes
   */
  variant?: 'plain' | 'rail';
  className?: string;
};

/** The marker's drawn height before scaling: it is moved and sized with a transform only */
const MARKER_BASE_PX = 100;

/** A heading counts as being read once its top passes this far below the viewport top (the header plus air) */
const READING_LINE = 120;

/**
 * The outline's links. The section being read (the last heading above the
 * reading line, or the first one before any has passed it) is set in accent
 * text; the others are muted. In the `rail` variant a marker on the rail
 * glides to it (transform only, instant under reduced motion).
 */
const TocLinks = ({ items, variant = 'plain', className }: Props) => {
  const [currentId, setCurrentId] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const rail = variant === 'rail';

  // Place the marker beside the current link (on every change and resize)
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentId moves the marker
  useLayoutEffect(() => {
    if (!rail) return;
    const place = () => {
      const marker = markerRef.current;
      const link = listRef.current?.querySelector<HTMLElement>(
        '[aria-current="location"]',
      );
      if (!marker || !link) return;
      marker.style.transform = `translateY(${link.offsetTop}px) scaleY(${link.offsetHeight / MARKER_BASE_PX})`;
      marker.style.opacity = '1';
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [rail, currentId]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let next: string | undefined = items[0]?.id;
      for (const { id } of items) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= READING_LINE) {
          next = id;
        }
      }
      // At the very bottom the last section is the one being read, however short
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) next = items.at(-1)?.id ?? next;
      setCurrentId(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return (
    <ol
      ref={listRef}
      className={cn(
        rail ? 'relative border-line border-s' : 'space-y-0.5',
        className,
      )}
    >
      {rail && (
        <span
          ref={markerRef}
          aria-hidden="true"
          style={{ height: MARKER_BASE_PX }}
          className="pointer-events-none absolute top-0 -start-px w-0.5 origin-top bg-accent-edge opacity-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        />
      )}
      {items.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={id === currentId ? 'location' : undefined}
            className={cn(
              'flex text-small text-fg-muted transition-colors duration-150 hover:text-fg aria-[current]:text-accent-ink focus-visible:-outline-offset-2 pointer-coarse:min-h-11',
              rail ? 'py-1.5 ps-4' : 'py-1',
            )}
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
};

export default TocLinks;
