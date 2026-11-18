'use client';

import Link from 'next/link';
import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CloseIcon } from '@/components/ui/icons';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import MobileLanguageList from './MobileLanguageList';
import MobileNavItems from './MobileNavItems';
import type { NavItem } from './navItems';

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** The header has handed its inline nav over to the menu button at a desktop width */
  collapsed: boolean;
  /** Where the header sits when the sheet opens, from the top of the viewport */
  top: number;
  items: NavItem[];
  pathname: string;
  logo: ReactNode;
  homeHref: string;
  globalPageProps: ResolvedGlobalPageProps;
  languages: SiteLocale[];
};

/** Same breakpoint as the header's inline nav (`lg`) */
const DESKTOP_QUERY = '(min-width: 64rem)';

/**
 * The navigation sheet, below 1024px (and wider while the header is
 * collapsed), built on a modal <dialog>: the page is inert, focus stays
 * inside, Escape closes it natively and focus returns to the menu button. It
 * is a white sheet from where the header sits to the bottom of the screen,
 * and it repeats the header row, so the logo and the button do not move.
 */
const MobileNav = ({
  id,
  open,
  onClose,
  collapsed,
  top,
  items,
  pathname,
  logo,
  homeHref,
  globalPageProps,
  languages,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { locale } = globalPageProps.params;
  const languageHeadingId = `${id}-language`;

  // `site-sheet` draws the fading sheet above the page during a route change
  const [openedOnPathname, setOpenedOnPathname] = useState<string>();
  if (open && openedOnPathname !== pathname) setOpenedOnPathname(pathname);
  const keepSheetAboveExitingPage = !open && openedOnPathname === pathname;

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

  // Close once the header shows its inline nav: the viewport grew past 1024px, or the items fit again
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

  // A press outside the sheet closes the menu
  const closeOnOutsideClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!sheetRef.current?.contains(event.target as Node)) onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively; the click only adds outside dismissal
    <dialog
      ref={dialogRef}
      id={id}
      aria-label={uiString(locale, 'menu')}
      onClose={onClose}
      onClick={closeOnOutsideClick}
      style={
        {
          '--sheet-top': `${top}px`,
          viewTransitionName: keepSheetAboveExitingPage
            ? 'site-sheet'
            : undefined,
        } as CSSProperties
      }
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 text-fg opacity-0 transition-[opacity,overlay,display] transition-discrete duration-100 ease-linear backdrop:bg-transparent open:opacity-100 starting:open:opacity-0"
    >
      <div
        ref={sheetRef}
        className="mt-(--sheet-top) flex h-[calc(100%-var(--sheet-top))] flex-col bg-surface"
      >
        {/* The header row, where the real header sits, so nothing moves when the sheet opens */}
        <div className="container-page flex h-(--header-h) shrink-0 items-center justify-between gap-4 border-line border-b">
          <Link
            href={homeHref}
            aria-label={uiString(locale, 'home')}
            onClick={onClose}
            className="flex shrink-0 items-center"
          >
            {logo}
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={uiString(locale, 'closeMenu')}
            onClick={onClose}
            className="-mr-2.5 grid size-11 place-items-center rounded-control transition-colors duration-150 hover:bg-subtle"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* The links fade and rise in as the sheet opens; the header row above stays put */}
          <div className="container-page pt-3 pb-10 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] starting:translate-y-1.5 starting:opacity-0">
            <nav aria-label={uiString(locale, 'mainNavigation')}>
              <MobileNavItems
                items={items}
                pathname={pathname}
                onNavigate={onClose}
              />
            </nav>

            {languages.length > 1 && (
              <div className="pt-8">
                <p
                  id={languageHeadingId}
                  className="mb-1 text-small font-medium text-fg"
                >
                  {uiString(locale, 'language')}
                </p>
                <MobileLanguageList
                  globalPageProps={globalPageProps}
                  languages={languages}
                  onNavigate={onClose}
                  labelledBy={languageHeadingId}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default MobileNav;
