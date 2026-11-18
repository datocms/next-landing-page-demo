'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useCallback, useRef, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { CaretIcon } from '@/components/ui/icons';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsHomeUrl, pageUrl } from '@/utils/routes';
import DocsNav from '../DocsNav';
import { DocsTreeContext, type DocsTreePage } from '../docsTree';
import DocsDrawer from './DocsDrawer';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  /** The documentation home's logo (the wordmark) */
  logo?: { url: string; width?: number | null; height?: number | null } | null;
  /** The documentation tree */
  pages: readonly DocsTreePage[];
  footerText?: string | null;
  languages: SiteLocale[];
  children: ReactNode;
};

const DRAWER_ID = 'docs-nav';

/**
 * The documentation chrome under the site header (which the layout renders,
 * with its pill menu): the tree in a sticky sidebar from 1024px; below, a slim
 * sticky bar under the header whose button opens the tree in a sheet; and the
 * content column with the docs footer line.
 */
const DocsShell = ({
  globalPageProps,
  logo,
  pages,
  footerText,
  languages,
  children,
}: Props) => {
  const pathname = usePathname();
  const { locale } = globalPageProps.params;
  const siteHref = pageUrl(globalPageProps, 'home');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  // `site-sheet` only on the page the drawer was opened on: a route change
  // starting while it is open draws it above the page, the new page never has it
  const [drawerShownOn, setDrawerShownOn] = useState<string>();

  // Close the drawer on every route change
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  // Rendered twice: in the header and, at the same place, in the drawer
  const brand = (
    <Link
      href={docsHomeUrl(globalPageProps)}
      aria-label={uiString(locale, 'docsHome')}
      className="flex shrink-0 items-center gap-2.5"
    >
      {logo?.url && (
        <Image
          src={logo.url}
          alt=""
          width={logo.width || 111}
          height={logo.height || 28}
          className="h-7 w-auto"
          preload
        />
      )}
      <span className="inline-flex min-h-6 items-center rounded-chip bg-subtle px-2.5 text-[0.78125rem] font-semibold text-accent-ink">
        {uiString(locale, 'docsBadge')}
      </span>
    </Link>
  );

  return (
    <DocsTreeContext value={pages}>
      {/* Below 1024px: the way into the topic tree, pinned under the site header */}
      <div className="sticky top-(--header-h) z-40 border-line border-b bg-surface lg:hidden">
        <div className="container-page flex h-12 items-center">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={drawerOpen}
            aria-controls={DRAWER_ID}
            onClick={() => {
              setDrawerShownOn(pathname);
              setDrawerOpen(true);
            }}
            className="-ml-3 inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 font-medium text-fg text-small transition-colors duration-150 hover:bg-subtle"
          >
            {uiString(locale, 'allTopics')}
            <CaretIcon className="size-3.5 text-fg-muted" />
          </button>
        </div>
      </div>

      {/* Pages fade inside it; this one fades when the layout itself is swapped (the site, another language) */}
      <PageTransition>
        <div className="container-page lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[15.5rem_minmax(0,1fr)] xl:gap-x-16">
          <aside className="max-lg:hidden">
            {/* The tree scrolls inside the sidebar; the side padding keeps the focus ring clear of the clip */}
            <div className="sticky top-(--header-h) -mx-3 max-h-[calc(100svh-var(--header-h))] overflow-y-auto overscroll-contain px-3 pt-8 pb-16">
              <DocsNav globalPageProps={globalPageProps} size="rail" />
            </div>
          </aside>

          <div className="flex min-h-[calc(100svh-var(--header-h))] min-w-0 flex-col">
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            {footerText && (
              <footer className="mt-20 border-line border-t py-8 text-small text-fg-muted">
                <p>{footerText}</p>
              </footer>
            )}
          </div>
        </div>
      </PageTransition>

      <DocsDrawer
        id={DRAWER_ID}
        open={drawerOpen}
        onClose={closeDrawer}
        menuButtonRef={menuButtonRef}
        viewTransitionName={
          drawerShownOn === pathname ? 'site-sheet' : undefined
        }
        brand={brand}
        siteHref={siteHref}
        globalPageProps={globalPageProps}
        languages={languages}
      />
    </DocsTreeContext>
  );
};

export default DocsShell;
