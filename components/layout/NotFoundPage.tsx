'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveUiLocale, uiString } from '@/lib/i18n/uiStrings';

/**
 * The 404 page, shared by app/[locale]/not-found.tsx (a missing record) and
 * app/not-found.tsx (a URL no route matches). Neither renders inside the
 * common layout, so there is no header or footer: the page stands on its own.
 * Inside a locale it picks up the project's accent color; the root one falls
 * back to the default --color-primary.
 *
 * Not-found pages receive no params, so the copy follows the first path
 * segment (the proxy always puts a locale there); anything unknown reads in
 * English. That needs the pathname, which makes this a client component. The
 * `lang` on <main> keeps the copy's language right on the root 404, whose
 * <html> can't know the locale.
 */
const NotFoundPage = () => {
  const segment = usePathname().split('/')[1] ?? '';
  const locale = resolveUiLocale(segment);
  // Back to this locale's home when the path names one; the root redirects by browser language
  const homeHref = segment === locale ? `/${locale}/home` : '/';
  const title = uiString(locale, 'notFoundTitle');
  const titleRest = uiString(locale, 'notFoundTitleRest');

  return (
    <main
      id="main"
      lang={locale}
      className="grid min-h-svh place-items-center px-(--pad) py-16"
    >
      {/* Hoisted into <head> by React: Next only reads `metadata` from the root not-found */}
      <title>{`${title} ${titleRest}`}</title>
      <div className="flex max-w-xl flex-col items-center text-center">
        <span aria-hidden="true" className="ring-mark size-12 [--ring-w:4px]" />
        <p className="label mt-6">404</p>
        <h1 className="mt-3 text-h1 text-ink">
          {title} <span className="text-ink-2">{titleRest}</span>
        </h1>
        <p
          data-hero-rise=""
          className="section-lead mt-4 text-balance [--d:0] [--lead-max:44ch]"
        >
          {uiString(locale, 'notFoundBody')}
        </p>
        <Link
          href={homeHref}
          data-hero-rise=""
          className="btn btn-primary mt-8 [--d:1]"
        >
          <ArrowLeft
            className="btn-arrow-back rtl:rotate-180"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {uiString(locale, 'backToHome')}
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
