'use client';

import { ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useCallback, useRef, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { uiString } from '@/lib/i18n/uiStrings';
import DocsNavDrawer from './DocsNavDrawer';

type Props = {
  /** Logo + "Docs" badge link, shown in the top bar and in the mobile drawer */
  brand: ReactNode;
  /** The documentation tree, shown in the sticky rail (lg) and the mobile drawer */
  nav: ReactNode;
  siteHref: string;
  footerText?: string | null;
  locale: string;
  children: ReactNode;
};

const DRAWER_ID = 'docs-nav-drawer';

/** Docs chrome: the top bar, the sticky nav rail from lg, and the same nav in a drawer below lg */
const DocsShell = ({
  brand,
  nav,
  siteHref,
  footerText,
  locale,
  children,
}: Props) => {
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  // `site-sheet` only on the page the drawer was shown on: a route change starting while it is open or
  // fading out draws it above the page, and the new page never has it
  const [drawerShownOn, setDrawerShownOn] = useState<string>();

  // Close the drawer on every route change
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  return (
    <>
      <a
        href="#main"
        className="btn btn-ink btn-sm fixed top-3 left-3 z-[60] not-focus:sr-only"
      >
        {uiString(locale, 'skipToContent')}
      </a>

      <header
        className="site-header"
        style={{ viewTransitionName: 'site-header' }}
        data-scrolled="true"
      >
        <div className="flex h-full items-center gap-4 px-(--pad)">
          {brand}

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={siteHref}
              className="btn btn-secondary btn-sm max-sm:hidden"
            >
              <ArrowLeft
                strokeWidth={1.75}
                aria-hidden="true"
                className="btn-arrow-back rtl:rotate-180"
              />
              {uiString(locale, 'backToSite')}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={uiString(locale, 'openDocsMenu')}
              aria-expanded={drawerOpen}
              aria-controls={DRAWER_ID}
              onClick={() => {
                setDrawerShownOn(pathname);
                setDrawerOpen(true);
              }}
              className="btn btn-icon size-11 rounded-full bg-well text-ink hover:bg-surface lg:hidden [&_svg]:size-5"
            >
              <Menu strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Pages fade inside it; this one fades when the layout itself is swapped (the site, another language) */}
      <PageTransition>
        <div className="lg:grid lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[17rem_minmax(0,1fr)]">
          {/* The tinted column runs the full height of the page; the tree sticks inside it */}
          <div className="hidden border-e border-line bg-well lg:block">
            <div className="sticky top-(--header-h) flex h-[calc(100svh-var(--header-h))] flex-col overflow-y-auto overscroll-contain py-6 ps-[calc(var(--pad)-12px)] pe-3 [--row-hover:var(--bg)]">
              {nav}
              {/* The site has no footer here: this line is the page's contentinfo landmark */}
              {footerText && (
                <footer className="mt-auto ps-3 pt-10 text-caption text-ink-3">
                  <p>{footerText}</p>
                </footer>
              )}
            </div>
          </div>

          <main id="main" tabIndex={-1} className="min-w-0 outline-none">
            {children}
          </main>
        </div>
      </PageTransition>

      <DocsNavDrawer
        id={DRAWER_ID}
        open={drawerOpen}
        onClose={closeDrawer}
        menuButtonRef={menuButtonRef}
        viewTransitionName={
          drawerShownOn === pathname ? 'site-sheet' : undefined
        }
        brand={brand}
        nav={nav}
        siteHref={siteHref}
        footerText={footerText}
        locale={locale}
      />
    </>
  );
};

export default DocsShell;
