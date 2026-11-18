'use client';

import { stripStega } from '@datocms/content-link';
import {
  Fragment,
  type FragmentInstance,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  ViewTransition,
} from 'react';

/*
 * Page transitions (the styles are styles/transitions.css).
 *
 * Every page is wrapped in <PageTransition>: on a route change the old page
 * fades out and the new one fades in, a few pixels low. What the motion looks
 * like depends on what the navigation meant, decided when it starts:
 *
 * - fade: the default, between two unrelated pages;
 * - forward / back: along a sequence (a link with rel="next" / rel="prev", or
 *   data-direction="forward" / "back"): the new page comes in from that side;
 * - language: the same page in another locale, a plain crossfade of the whole
 *   page (started by hand: React does not animate a root layout swap). Back
 *   and Forward between languages are not animated: Next swaps the root
 *   layout before the popstate event.
 *
 * Going deeper keeps the thing pressed: a <SharedElement> on a listing (a
 * post's cover, a release's tile, a member's portrait) and the one at the top
 * of the page it links to share a name for that one navigation (the intent's
 * `share`: the deeper page's path), so the browser morphs one into the other.
 *
 * Back and Forward replay the navigation that made the history entry: mirrored
 * when going back over it (posts page 2 to 1 comes in from the left, a post's
 * cover returns into its card), the same when going forward again.
 *
 * Two things React and Next do not do on their own here:
 *
 * - Direction is not a transition type. next/link's `transitionTypes` reach
 *   only link clicks; Back and Forward run inside Next's popstate transition,
 *   which takes none. So the intent lives in a small store set at the start of
 *   every navigation (a click, captured before next/link handles it, or a
 *   popstate) and read while rendering: the old page renders its exit class and
 *   its shared element's name before the navigation commits, the new page
 *   renders with them.
 * - React commits a transition started during a popstate event synchronously,
 *   so the browser can restore the scroll position, and a synchronous commit
 *   never animates. Where the Navigation API is available, Back and Forward are
 *   handed to Next just after the event instead (the same event, re-dispatched
 *   from a task), so they animate like any navigation; the scroll position is
 *   then restored by the page itself (history.scrollRestoration is "manual"
 *   while the site is open, and each history entry's position is remembered).
 *   Without the Navigation API, Back and Forward stay as they were: instant.
 *
 * Draft Mode updates stay still: nothing here animates an update (default="none").
 * Without view transitions React simply commits; under reduced motion every
 * duration is zero (styles/base.css).
 */

type Motion = 'fade' | 'forward' | 'back' | 'language';
type Direction = 'forward' | 'back';

type Intent = {
  motion: Motion;
  /** The path whose shared elements pair up in this navigation (the deeper page) */
  share: string | null;
  /** Counts navigations, so a late reset never clears a newer intent */
  id: number;
};

const IDLE: Intent = { motion: 'fade', share: null, id: 0 };

let intent = IDLE;
const subscribers = new Set<() => void>();

const setIntent = (next: Intent) => {
  intent = next;
  for (const notify of subscribers) notify();
};
const subscribe = (notify: () => void) => {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
};
const currentIntent = () => intent;
const idleIntent = () => IDLE;

/** A site path as the address bar has it: no Draft Mode markers, percent-encoded */
const normalizePath = (path: string) => {
  try {
    return new URL(stripStega(path).trim(), 'https://site.invalid').pathname;
  } catch {
    return path;
  }
};

const localeOf = (path: string) => path.split('/')[1] ?? '';

/** What each navigation did, by "from to", so Back and Forward can replay it */
const journeys = new Map<string, { motion: Motion; share: string | null }>();
const journeyKey = (from: string, to: string) => `${from} ${to}`;
const MIRROR: Record<Motion, Motion> = {
  fade: 'fade',
  forward: 'back',
  back: 'forward',
  language: 'language',
};

/** The path on screen: popstate only reports where it goes */
let shownPath = '';

/** A navigation happened in this visit (a new <html>, for another language, starts without the attribute) */
let navigatedOnce = false;
/** From now on pages arrive through the transition: their load-time entrances stay still (styles/transitions.css) */
const markNavigated = () => {
  navigatedOnce = true;
  document.documentElement.dataset.navigated = '';
};

/**
 * A change of language swaps the root layout (<html> included), and React
 * starts no view transition for it: the crossfade is started here, by hand, as
 * the link is clicked. The browser captures the page as it is, then waits for
 * the new language's <html lang>. The page is frozen meanwhile (as it would be
 * anyway, waiting), so a slow response gives up after 1.2s: the page then
 * simply changes when it arrives.
 */
const crossfadeLanguage = () => {
  if (typeof document.startViewTransition !== 'function') return;
  const root = document.documentElement;
  const lang = root.lang;
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          observer.disconnect();
          window.clearTimeout(timer);
          // The new <html> does not carry it over
          markNavigated();
          resolve();
        };
        const observer = new MutationObserver(() => {
          if (root.lang !== lang) done();
        });
        observer.observe(root, {
          attributes: true,
          attributeFilter: ['lang'],
        });
        const timer = window.setTimeout(done, 1200);
        if (root.lang !== lang) done();
      }),
  );
  // Skipped (another transition started): the navigation still happens
  transition.finished.catch(() => {});
};

const begin = (from: string, to: string, direction: Direction | null) => {
  const motion: Motion =
    localeOf(from) !== localeOf(to) ? 'language' : (direction ?? 'fade');
  // Along a sequence or across languages the whole page moves: nothing is shared
  const share = motion === 'fade' ? to : null;
  journeys.set(journeyKey(from, to), { motion, share });
  shownPath = to;
  pendingScroll = null;
  markNavigated();
  setIntent({ motion, share, id: intent.id + 1 });
  queueMicrotask(dropOffscreenShared);
  // next/link starts the navigation right after this click handler
  if (motion === 'language') crossfadeLanguage();
};

/** The link's place in a sequence: rel="next"/"prev" or data-direction */
const directionOf = (link: HTMLAnchorElement): Direction | null => {
  const { direction } = link.dataset;
  if (direction === 'forward' || direction === 'back') return direction;
  if (link.relList.contains('next')) return 'forward';
  if (link.relList.contains('prev')) return 'back';
  return null;
};

// Capture phase: runs before next/link's click handler starts the navigation
const onClick = (event: MouseEvent) => {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  const link =
    event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (
    !(link instanceof HTMLAnchorElement) ||
    (link.target && link.target !== '_self') ||
    link.hasAttribute('download')
  ) {
    return;
  }
  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname) return;
  begin(window.location.pathname, url.pathname, directionOf(link));
};

/** Navigation API entries: the key of each history entry, to remember its scroll position */
type NavigationApi = EventTarget & {
  currentEntry: { key: string } | null;
};
type NavigateEvent = Event & {
  navigationType: 'push' | 'replace' | 'reload' | 'traverse';
  destination: { key: string; sameDocument: boolean };
};
const navigationApi = () =>
  (window as Window & { navigation?: NavigationApi }).navigation;

/** Back and Forward can animate: the Navigation API to key positions, and view transitions */
const historyCanAnimate = () =>
  typeof navigationApi() === 'object' &&
  typeof document.startViewTransition === 'function';

const POSITIONS_KEY = 'page-transition-positions';
/** The scroll position of each history entry of this tab, by entry key */
let positions: Record<string, number> = {};
/** Where the page that is about to mount should be scrolled to (Back, Forward) */
let pendingScroll: number | null = null;

let scrollFrame = 0;
const onScroll = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    const key = navigationApi()?.currentEntry?.key;
    if (key) positions[key] = Math.round(window.scrollY);
  });
};

const savePositions = () => {
  try {
    sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  } catch {}
};
let positionsLoaded = false;
/** Once per visit: the listeners come and go when the root layout is swapped (another language) */
const loadPositions = () => {
  if (positionsLoaded) return;
  positionsLoaded = true;
  try {
    positions = JSON.parse(sessionStorage.getItem(POSITIONS_KEY) ?? '{}');
  } catch {
    positions = {};
  }
};

// Leaving the site (or reloading): the browser restores the scroll position again
const onPageHide = () => {
  savePositions();
  history.scrollRestoration = 'auto';
};
const onPageShow = () => {
  history.scrollRestoration = 'manual';
};

/**
 * Every Back or Forward, before anything renders: where the page that will
 * mount must be scrolled to. (Next commits a change of language before the
 * popstate event, so this is the one place that sees all of them.)
 */
const onNavigate = (event: Event) => {
  const { navigationType, destination } = event as NavigateEvent;
  if (navigationType !== 'traverse' || !destination.sameDocument) return;
  pendingScroll = positions[destination.key] ?? 0;
};

/** The remembered position of the entry Back or Forward lands on */
const restoredPosition = () => {
  const key = navigationApi()?.currentEntry?.key;
  return (key && positions[key]) || 0;
};

// Capture phase: it runs before Next's own popstate listener
const onPopState = (event: PopStateEvent) => {
  // The event handed back to Next below
  if (!event.isTrusted) return;

  const animate = historyCanAnimate();
  const from = shownPath || window.location.pathname;
  const to = window.location.pathname;
  if (from === to) {
    // Within the page (a #fragment): nothing to animate, only the position
    pendingScroll = null;
    if (animate)
      window.scrollTo({ top: restoredPosition(), behavior: 'instant' });
    return;
  }

  // Back over a navigation: mirror it. Forward again: replay it
  const back = journeys.get(journeyKey(to, from));
  const again = journeys.get(journeyKey(from, to));
  const motion: Motion = back
    ? MIRROR[back.motion]
    : again
      ? again.motion
      : localeOf(from) !== localeOf(to)
        ? 'language'
        : 'fade';
  // Unrecorded (after a reload): returning from a page puts its shared element back
  const share = back ? back.share : again ? again.share : from;
  shownPath = to;
  markNavigated();
  setIntent({
    motion,
    share: motion === 'fade' ? share : null,
    id: intent.id + 1,
  });
  queueMicrotask(dropOffscreenShared);

  // Back or Forward to another language: Next has already swapped the root
  // layout by now (it acts on the navigation itself), so it simply happens
  if (!animate || motion === 'language') return;
  // Next handles the same event from a task, outside the popstate event, so React
  // runs it as an ordinary transition (with its view transition)
  event.stopImmediatePropagation();
  pendingScroll = restoredPosition();
  const { state } = event;
  window.setTimeout(() => {
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }, 0);
};

let listeners = 0;
const listen = () => {
  if (listeners++ === 0) {
    shownPath = window.location.pathname;
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState, true);
    if (historyCanAnimate()) {
      loadPositions();
      history.scrollRestoration = 'manual';
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pagehide', onPageHide);
      window.addEventListener('pageshow', onPageShow);
      navigationApi()?.addEventListener('navigate', onNavigate);
    }
  }
  return () => {
    if (--listeners === 0) {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState, true);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      navigationApi()?.removeEventListener('navigate', onNavigate);
      if (historyCanAnimate()) history.scrollRestoration = 'auto';
    }
  };
};

/**
 * A page mounting, inside the view transition's update (before the new state is
 * captured): after Back or Forward, scrolled where it was; after any navigation,
 * its load-time entrances held. (A page opened by a link is scrolled to its top
 * by Next, after this runs: its shared element, at the top, is on screen.)
 */
const arrive = () => {
  if (navigatedOnce) document.documentElement.dataset.navigated = '';
  if (pendingScroll === null) return;
  window.scrollTo({ top: pendingScroll, behavior: 'instant' });
  pendingScroll = null;
  dropOffscreenShared();
};

/** Back to the plain fade once the new page is in, so a navigation started elsewhere (router.push) never inherits a direction */
const settle = () => {
  shownPath = window.location.pathname;
  const { id } = intent;
  if (id === 0) return;
  const reset = () => {
    if (intent.id === id) setIntent({ ...IDLE, id });
  };
  const active = (
    document as Document & {
      activeViewTransition?: { finished: Promise<unknown> } | null;
    }
  ).activeViewTransition;
  if (active) active.finished.then(reset, reset);
  else window.setTimeout(reset, 600);
};

/**
 * A shared element only travels between two places on screen: one outside the
 * viewport (the top of a post Forward returns to halfway down, a cover scrolled
 * away) loses its name and simply goes with its page. Runs on the old page once
 * it has rendered its names (a microtask after the intent, after React's
 * synchronous commit), and on a page Back or Forward brings, once scrolled.
 */
function dropOffscreenShared() {
  for (const element of document.querySelectorAll<HTMLElement>(
    '[style*="view-transition-name"]',
  )) {
    const shareClass =
      element.style.getPropertyValue('view-transition-class') || '';
    if (!shareClass.startsWith('share-')) continue;
    const { top, bottom } = element.getBoundingClientRect();
    if (bottom <= 0 || top >= window.innerHeight) {
      element.style.setProperty('view-transition-name', 'none');
    }
  }
}

const PAGE_CLASSES: Record<Motion, { enter: string; exit: string }> = {
  fade: { enter: 'page-enter', exit: 'page-exit' },
  forward: { enter: 'page-enter-forward', exit: 'page-exit-forward' },
  back: { enter: 'page-enter-back', exit: 'page-exit-back' },
  language: { enter: 'page-fade-in', exit: 'page-fade-out' },
};

/** Animates its content in and out on navigations; refreshes and Draft Mode updates stay still */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { motion } = useSyncExternalStore(subscribe, currentIntent, idleIntent);

  useEffect(listen, []);
  useLayoutEffect(arrive, []);
  // A page mounting after a navigation: once it is in, the next one starts from the default
  useEffect(settle, []);

  const { enter, exit } = PAGE_CLASSES[motion];
  return (
    <ViewTransition enter={enter} exit={exit} default="none">
      {children}
    </ViewTransition>
  );
};

export default PageTransition;

/**
 * cover: a post's cover. release: a release's tile and its page header.
 * portrait: a member's portrait and the one on their author page
 */
type SharedKind = 'cover' | 'release' | 'portrait';

/** How each travels (styles/transitions.css): its view-transition-class */
const SHARE_CLASS: Record<SharedKind, string> = {
  cover: 'share-cover',
  release: 'share-tile',
  portrait: 'share-portrait',
};

/** A view-transition-name from a path: letters, digits, - and _ only */
const sharedName = (kind: SharedKind, path: string) =>
  `${kind}${path.replace(/[^\w-]/g, '_')}`;

type SharedElementProps = {
  kind: SharedKind;
  /** The page this thing belongs to (the post, the release, the author page), or opens */
  href: string;
  /** One element (the first one rendered gets the name) */
  children: ReactNode;
};

/** React DOM's fragment ref: its observeUsing hands over the fragment's host children */
type ChildObserver = {
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
};
type ObservableFragment = FragmentInstance & {
  observeUsing?: (observer: ChildObserver) => void;
  unobserveUsing?: (observer: ChildObserver) => void;
};

/** The first element a fragment renders */
const firstElementOf = (fragment: ObservableFragment | null) => {
  let first: HTMLElement | null = null;
  const finder: ChildObserver = {
    observe: (target) => {
      if (!first && target instanceof HTMLElement) first = target;
    },
    unobserve: () => {},
  };
  fragment?.observeUsing?.(finder);
  fragment?.unobserveUsing?.(finder);
  return first as HTMLElement | null;
};

/**
 * The same thing on two pages: on a listing, the link to a page (a card's
 * cover); on that page, the same thing at its top (the post's cover). Both get
 * the same view-transition-name only while that page is being opened or left,
 * so exactly one pair exists and the browser morphs one into the other.
 *
 * The name is set on the element itself (its inline style, in a layout effect:
 * before the old page is captured, and on the new page before it is), not
 * through a named <ViewTransition>: React's pairing misses a named boundary
 * inside a page that Back or Forward brought in, when Back or Forward leaves it
 * again. The browser pairs inline names on its own. The element is found
 * through a fragment ref, so its children stay exactly as rendered (server
 * output included) and no wrapper is added.
 */
export const SharedElement = ({ kind, href, children }: SharedElementProps) => {
  const { share } = useSyncExternalStore(subscribe, currentIntent, idleIntent);
  const path = normalizePath(href);
  const named = share === path;
  const fragment = useRef<FragmentInstance>(null);

  useLayoutEffect(() => {
    if (!named) return;
    const element = firstElementOf(fragment.current);
    if (!element) return;
    element.style.setProperty('view-transition-name', sharedName(kind, path));
    element.style.setProperty('view-transition-class', SHARE_CLASS[kind]);
    return () => {
      element.style.removeProperty('view-transition-name');
      element.style.removeProperty('view-transition-class');
    };
  }, [named, kind, path]);

  return <Fragment ref={fragment}>{children}</Fragment>;
};
