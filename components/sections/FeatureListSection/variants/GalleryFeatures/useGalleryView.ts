import { useEffect, useRef, useState } from 'react';

/** What the gallery's counter, arrows and progress show */
type GalleryView = {
  /** First and last fully visible card */
  first: number;
  last: number;
  atStart: boolean;
  atEnd: boolean;
  /** Nothing overflows: the controls and progress step aside */
  fitsAll: boolean;
};

const INITIAL_VIEW: GalleryView = {
  first: 0,
  last: 0,
  atStart: true,
  atEnd: false,
  fitsAll: false,
};

/** Slack in px for sub-pixel card edges and scroll positions */
const SLACK = 2;

const sameView = (a: GalleryView, b: GalleryView) =>
  a.first === b.first &&
  a.last === b.last &&
  a.atStart === b.atStart &&
  a.atEnd === b.atEnd &&
  a.fitsAll === b.fitsAll;

/** The cards are the `<li>`s of the list inside the track */
const getCards = (track: HTMLElement) =>
  Array.from(track.querySelectorAll<HTMLElement>(':scope > ol > li'));

/** Reads the view off the track's layout and scroll position */
const measureView = (track: HTMLElement): GalleryView => {
  const cards = getCards(track);
  const box = track.getBoundingClientRect();
  const paddingStart =
    Number.parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  // The visible strip: from the track's padded start to its end, cut by the viewport
  const visibleLeft = box.left + paddingStart - SLACK;
  const visibleRight = Math.min(box.right, window.innerWidth) + SLACK;

  let first = -1;
  let last = -1;
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.left >= visibleLeft && rect.right <= visibleRight) {
      if (first < 0) first = i;
      last = i;
    }
    const distance = Math.abs(rect.left - visibleLeft);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = i;
    }
  });
  // No card fits whole: count the one nearest the start
  if (first < 0) {
    first = nearest;
    last = nearest;
  }

  const maxScroll = track.scrollWidth - track.clientWidth;
  // scrollLeft is negative in right-to-left pages
  const scrolled = Math.abs(track.scrollLeft);

  return {
    first,
    last,
    atStart: scrolled <= SLACK,
    atEnd: scrolled >= maxScroll - SLACK,
    fitsAll: maxScroll <= SLACK,
  };
};

/**
 * Tracks which gallery cards are fully visible, re-measuring once per frame
 * on scroll and resize. Returns the ref for the scroll track, the current
 * view and `scrollByCard`, which moves the track exactly one card.
 */
export default function useGalleryView() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<GalleryView>(INITIAL_VIEW);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const next = measureView(track);
      setView((prev) => (sameView(prev, next) ? prev : next));
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    if (track.firstElementChild) observer.observe(track.firstElementChild);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track || (direction < 0 ? view.atStart : view.atEnd)) return;

    const cards = getCards(track);
    // One card plus the gap: the distance between two card starts
    const step =
      cards.length > 1
        ? Math.abs(cards[1].offsetLeft - cards[0].offsetLeft)
        : track.clientWidth;
    const isRtl = getComputedStyle(track).direction === 'rtl';
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    track.scrollBy({
      left: direction * step * (isRtl ? -1 : 1),
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  };

  return { trackRef, view, scrollByCard };
}
