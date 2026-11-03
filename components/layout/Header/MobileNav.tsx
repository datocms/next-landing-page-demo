'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import LanguageList from './LanguageList';
import MobileNavItems from './MobileNavItems';
import type { NavItem } from './navItems';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** The header has handed its inline nav over to the menu button at a desktop width */
  collapsed: boolean;
  /** Where the header sits when the menu opens (below the announcement while it is in view) */
  top: number;
  /** Mirrors the header's hairline state, so the replicated header row matches it */
  scrolled: boolean;
  items: NavItem[];
  pathname: string;
  logo: ReactNode;
  homeHref: string;
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
};

/** Same breakpoint as the header's inline nav (`min-[72rem]`) */
const DESKTOP_QUERY = '(min-width: 72rem)';

/**
 * Menu sheet below 72rem (and wider while the header is collapsed), built on
 * a modal <dialog> so the page is inert, focus stays inside, Escape closes it
 * natively and focus returns to the menu button. It replicates the header row
 * where the header sits (the logo and the close button stay put), then shows
 * a rounded white sheet over a soft white scrim.
 */
const MobileNav = ({
  id,
  open,
  onClose,
  collapsed,
  top,
  scrolled,
  items,
  pathname,
  logo,
  homeHref,
  globalPageProps,
  languages,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const headerRowRef = useRef<HTMLDivElement>(null);
  const { locale } = globalPageProps.params;
  const languageHeadingId = `${id}-language`;

  // `site-sheet` only while the sheet fades out on the page it was shown on: a route change starting
  // meanwhile draws it above the page, the new page never has it, and while open the scrim keeps its blur
  const [openedOnPathname, setOpenedOnPathname] = useState<string>();
  if (open && openedOnPathname !== pathname) setOpenedOnPathname(pathname);
  const fadingOut = !open && openedOnPathname === pathname;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Lock page scroll while open
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  // Close once the header shows its inline nav: the viewport grew past 72rem, or the items fit again
  useEffect(() => {
    if (!open) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (desktop.matches && !collapsed) onClose();
    };
    onChange();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [open, onClose, collapsed]);

  // A press on the scrim (or on the announcement showing above the header row) closes the menu
  const closeOnOutsideClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as Node;
    if (
      !sheetRef.current?.contains(target) &&
      !headerRowRef.current?.contains(target)
    ) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively; the click only adds scrim dismissal
    <dialog
      ref={dialogRef}
      id={id}
      aria-label={uiString(locale, 'menu')}
      onClose={onClose}
      onClick={closeOnOutsideClick}
      style={
        {
          '--sheet-top': `${top}px`,
          viewTransitionName: fadingOut ? 'site-sheet' : undefined,
        } as CSSProperties
      }
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 text-ink opacity-0 transition-[opacity,overlay,display] transition-discrete duration-[120ms] ease-standard backdrop:bg-transparent open:opacity-100 open:duration-[180ms] open:ease-out-quint starting:open:opacity-0"
    >
      <div className="flex h-full flex-col pt-(--sheet-top)">
        {/* The header row, where the real header sits, so nothing moves when the menu opens */}
        <div
          ref={headerRowRef}
          className="site-header relative shrink-0"
          data-scrolled={scrolled}
        >
          <div className="container-page flex h-full items-center justify-between gap-4">
            <Link
              href={homeHref}
              aria-label={uiString(locale, 'home')}
              onClick={onClose}
              className="hit-44 flex shrink-0 items-center rounded-lg"
            >
              {logo}
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={uiString(locale, 'closeMenu')}
              onClick={onClose}
              className="btn btn-icon size-11 bg-well text-ink hover:bg-surface"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white/60 p-2 backdrop-blur-[6px]">
          <nav
            ref={sheetRef}
            aria-label={uiString(locale, 'mainNavigation')}
            className="rounded-[24px] bg-white p-2 shadow-card transition-[translate] duration-[180ms] ease-out-quint motion-safe:starting:-translate-y-2"
          >
            <MobileNavItems
              items={items}
              pathname={pathname}
              onNavigate={onClose}
            />

            {languages.length > 1 && (
              <div className="mt-2 border-line border-t px-2.5 pt-4 pb-2.5">
                <p id={languageHeadingId} className="mono mb-3 ml-2">
                  {uiString(locale, 'language')}
                </p>
                <LanguageList
                  globalPageProps={globalPageProps}
                  languages={languages}
                  onNavigate={onClose}
                  labelledBy={languageHeadingId}
                />
              </div>
            )}
          </nav>
        </div>
      </div>
    </dialog>
  );
};

export default MobileNav;
