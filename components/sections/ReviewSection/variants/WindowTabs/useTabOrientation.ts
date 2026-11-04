import { useSyncExternalStore } from 'react';

type Orientation = 'vertical' | 'horizontal';

/*
 * The list is a sidebar column from md (48rem) up and a horizontal pill strip
 * below it, so its announced orientation follows the same breakpoint. The
 * server and the hydration pass assume the sidebar; the browser corrects it
 * right after. Every arrow key works in both layouts regardless.
 */
const SIDEBAR_QUERY = '(min-width: 48rem)';

const subscribeToSidebar = (onChange: () => void) => {
  const query = window.matchMedia(SIDEBAR_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const readOrientation = (): Orientation =>
  window.matchMedia(SIDEBAR_QUERY).matches ? 'vertical' : 'horizontal';
const serverOrientation = (): Orientation => 'vertical';

/** The reviewer tab list's aria-orientation: vertical as a sidebar, horizontal as a phone strip */
export const useTabOrientation = () =>
  useSyncExternalStore(subscribeToSidebar, readOrientation, serverOrientation);
