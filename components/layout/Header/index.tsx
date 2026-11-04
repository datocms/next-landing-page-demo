'use client';

import { isEmptyDocument } from 'datocms-structured-text-utils';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import NotificationStrip from './NotificationStrip';
import { buildNavItems } from './navItems';
import { useNavCollapse } from './useNavCollapse';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  fragment: FragmentOf<typeof HeaderFragment> | null;
  languages: SiteLocale[];
};

const MOBILE_NAV_ID = 'mobile-nav';

/**
 * The site header: skip link, dismissible announcement bar, then the logo,
 * the inline nav and the language selector, or the menu button that opens
 * the mobile menu when the nav doesn't fit
 */
const Header = ({ globalPageProps, fragment, languages }: Props) => {
  const layout = readFragment(HeaderFragment, fragment);
  const pathname = usePathname();
  const navItems = buildNavItems(layout?.menu, globalPageProps);
  const homeHref = pageUrl(globalPageProps, 'home');
  const { locale } = globalPageProps.params;

  const [notificationVisible, setNotificationVisible] = useState(
    !isEmptyDocument(layout?.notification),
  );
  const notificationRef = useRef<HTMLElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const dismissNotification = () => {
    setNotificationVisible(false);
    // The dismiss button disappears: keep keyboard focus at the top of the page
    logoLinkRef.current?.focus();
  };

  // The hairline under the header shows once the announcement has scrolled away
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    // Re-run after a dismissal: the threshold drops to 0
    const onScroll = () => {
      const threshold = notificationVisible
        ? (notificationRef.current?.offsetHeight ?? 0)
        : 0;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [notificationVisible]);

  // Mobile menu, closed again on every route change
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const openMenu = () => {
    // The sheet replicates the header exactly where it sits now (below the announcement when it is in view)
    setMenuTop(
      Math.max(0, notificationRef.current?.getBoundingClientRect().bottom ?? 0),
    );
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

  const logo = layout?.logo.url ? (
    <Image
      src={layout.logo.url}
      alt=""
      width={138}
      height={27}
      className="h-[22px] w-auto lg:h-6"
      preload
    />
  ) : null;

  return (
    <>
      <a
        href="#main"
        className="btn btn-ink btn-sm fixed top-3 left-3 z-[60] not-focus:sr-only"
      >
        {uiString(locale, 'skipToContent')}
      </a>

      {notificationVisible && (
        <NotificationStrip
          ref={notificationRef}
          notification={layout?.notification}
          globalPageProps={globalPageProps}
          onDismiss={dismissNotification}
        />
      )}

      {/* overflow-x-clip: however many items the CMS adds, nothing in the header can widen the page */}
      <header
        className="site-header group/header overflow-x-clip"
        style={{ viewTransitionName: 'site-header' }}
        data-scrolled={scrolled}
        data-collapsed={collapsed}
      >
        <div className="container-page flex h-full items-center gap-4 md:gap-5 xl:gap-7">
          <Link
            ref={logoLinkRef}
            href={homeHref}
            aria-label={uiString(locale, 'home')}
            className="hit-44 flex shrink-0 items-center rounded-lg"
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

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2">
            {languages.length > 1 && (
              <div
                ref={languageRef}
                className="hidden min-[72rem]:block group-data-[collapsed=true]/header:invisible group-data-[collapsed=true]/header:absolute group-data-[collapsed=true]/header:right-0"
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
              className="btn btn-icon size-11 bg-well text-ink hover:bg-surface group-data-[collapsed=false]/header:min-[72rem]:hidden"
            >
              <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        id={MOBILE_NAV_ID}
        open={menuOpen}
        onClose={closeMenu}
        collapsed={collapsed}
        top={menuTop}
        scrolled={scrolled}
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
