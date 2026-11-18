'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import MotionObserver from '@/components/motion/MotionObserver';
import { MenuIcon } from '@/components/ui/icons';
import {
  type FragmentOf,
  readFragment,
  type SiteLocale,
} from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { pageUrl } from '@/utils/routes';
import DesktopNav from './DesktopNav';
import { HeaderFragment } from './fragment';
import LanguageSelector from './LanguageSelector';
import MobileNav from './MobileNav';
import { buildNavItems } from './navItems';
import { useNavCollapse } from './useNavCollapse';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  fragment: FragmentOf<typeof HeaderFragment> | null;
  languages: SiteLocale[];
};

const MOBILE_NAV_ID = 'mobile-nav';

/**
 * The site header: skip link, then the
 * sticky row with the logo, the CMS menu and the language menu, or the menu
 * button that opens the navigation sheet when the menu doesn't fit
 */
const Header = ({ globalPageProps, fragment, languages }: Props) => {
  const layout = readFragment(HeaderFragment, fragment);
  const pathname = usePathname();
  const navItems = buildNavItems(layout?.menu, globalPageProps);
  const homeHref = pageUrl(globalPageProps, 'home');
  const { locale } = globalPageProps.params;

  const logoLinkRef = useRef<HTMLAnchorElement>(null);

  // At the top the header is transparent, so a hero panel shows through it; once the
  // page has scrolled its white backing (a ::before, so only opacity animates) fades in
  // with a hairline under it
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigation sheet, closed again on every route change
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const openMenu = () => {
    setMenuTop(0);
    setMenuOpen(true);
  };
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const { collapsed, navRef, listRef, languageRef, menuButtonRef } =
    useNavCollapse();

  // The wordmark is an SVG about 28px tall; its own size keeps the slot from shifting
  const logo = layout?.logo.url ? (
    <Image
      src={layout.logo.url}
      alt=""
      width={layout.logo.width ?? 111}
      height={layout.logo.height ?? 28}
      className="h-7 w-auto"
      preload
    />
  ) : null;

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-70 inline-flex min-h-9 items-center rounded-control border border-line bg-surface px-3.5 text-small font-medium text-fg shadow-float not-focus:sr-only"
      >
        {uiString(locale, 'skipToContent')}
      </a>

      <header
        className="group/header sticky top-0 z-50 h-(--header-h) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-surface before:opacity-0 before:shadow-[0_1px_0_var(--color-line)] before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.2,0.7,0.2,1)] before:content-[''] data-[scrolled=true]:before:opacity-100"
        style={{ viewTransitionName: 'site-header' }}
        data-scrolled={scrolled}
        data-collapsed={collapsed}
      >
        <div className="container-page flex h-full items-center gap-6">
          <Link
            ref={logoLinkRef}
            href={homeHref}
            aria-label={uiString(locale, 'home')}
            className="flex shrink-0 items-center transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:opacity-85 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98] motion-safe:active:duration-100"
          >
            {logo}
          </Link>

          <DesktopNav
            ref={navRef}
            listRef={listRef}
            items={navItems}
            pathname={pathname}
            locale={locale}
          />

          <div className="relative z-10 ml-auto flex shrink-0 items-center">
            {languages.length > 1 && (
              <div
                ref={languageRef}
                className="hidden group-data-[collapsed=true]/header:invisible group-data-[collapsed=true]/header:absolute group-data-[collapsed=true]/header:right-0 lg:block"
              >
                <LanguageSelector
                  globalPageProps={globalPageProps}
                  languages={languages}
                />
              </div>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={uiString(locale, 'openMenu')}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_NAV_ID}
              onClick={openMenu}
              className="-mr-2.5 grid size-11 place-items-center rounded-full text-fg transition-colors duration-150 hover:bg-surface/70 group-data-[collapsed=false]/header:lg:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* The page's one reveal and loop observer (components/motion) */}
      <MotionObserver />

      <MobileNav
        id={MOBILE_NAV_ID}
        open={menuOpen}
        onClose={closeMenu}
        collapsed={collapsed}
        top={menuTop}
        items={navItems}
        pathname={pathname}
        logo={logo}
        homeHref={homeHref}
        globalPageProps={globalPageProps}
        languages={languages}
      />
    </>
  );
};

export default Header;
