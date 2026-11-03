'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/** Room the inline nav keeps after its last item; with less it hands over to the menu button */
const NAV_SLACK = 40;

/**
 * The inline nav shows from 72rem, but the CMS decides how many items it
 * holds: when they don't fit, the header collapses to the menu button at
 * any width. While collapsed, the nav and the language pill stay laid out
 * (invisible, the pill out of flow) so the inline layout can still be
 * measured and restored as soon as it fits again.
 *
 * Returns the collapsed state and the refs of the four elements it measures.
 */
export function useNavCollapse() {
  const [collapsed, setCollapsed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const list = listRef.current;
    if (!nav || !list) return;

    const measure = () => {
      // Below 72rem the nav is not rendered and the header is in its menu layout anyway
      if (!nav.getClientRects().length) return;
      setCollapsed((wasCollapsed) => {
        // Collapsed, the menu button sits where the language pill goes inline,
        // so the inline nav would be wider by the difference
        const widthGainedInline = wasCollapsed
          ? (menuButtonRef.current?.offsetWidth ?? 0) -
            (languageRef.current?.offsetWidth ?? 0)
          : 0;
        const inlineNavWidth =
          nav.getBoundingClientRect().width + widthGainedInline;
        return list.getBoundingClientRect().width + NAV_SLACK > inlineNavWidth;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    observer.observe(list);
    if (languageRef.current) observer.observe(languageRef.current);
    return () => observer.disconnect();
  }, []);

  return { collapsed, navRef, listRef, languageRef, menuButtonRef };
}
