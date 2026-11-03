import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { getAvailableLocales } from '@/lib/i18n/locales';

// Fetch caching has no effect in Proxy, so keep the locales in memory for a
// minute instead of querying DatoCMS on every request (a failed lookup is
// retried on the next request)
const LOCALES_TTL_MS = 60_000;

let cachedLocales: Promise<SiteLocale[]> | undefined;
let cachedLocalesExpireAt = 0;

function getCachedLocales() {
  if (!cachedLocales || Date.now() > cachedLocalesExpireAt) {
    cachedLocalesExpireAt = Date.now() + LOCALES_TTL_MS;
    cachedLocales = getAvailableLocales().catch((error) => {
      cachedLocales = undefined;
      throw error;
    });
  }
  return cachedLocales;
}

/**
 * The project locale that best matches the browser's Accept-Language header
 * (the first locale when nothing matches). DatoCMS writes locales with an
 * underscore (pt_BR), browsers with a hyphen (pt-BR), so both sides are
 * compared in the hyphen form.
 */
function findBestLocaleForVisitor(
  request: Request,
  locales: SiteLocale[],
): SiteLocale {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const hyphenatedLocales = locales.map((locale) =>
    locale.replaceAll('_', '-'),
  );
  const languages = new Negotiator({
    headers: Object.fromEntries(headers.entries()),
  }).languages(hyphenatedLocales);
  const bestMatch = match(languages, hyphenatedLocales, hyphenatedLocales[0]);

  return bestMatch.replaceAll('-', '_') as SiteLocale;
}

/**
 * Every page URL starts with one of the project's locales. A URL without one
 * gets the visitor's best match, and a bare locale (or the site root) leads to
 * its home page. For an English-speaking visitor: `/` → `/en/home`,
 * `/pricing` → `/en/pricing`, `/it` → `/it/home`.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locales = await getCachedLocales();

  const localeInPathname = locales.find((locale) =>
    pathname.match(new RegExp(`^/${locale}($|/)`)),
  );

  const locale = localeInPathname || findBestLocaleForVisitor(request, locales);

  const pathnameWithoutLocale = localeInPathname
    ? pathname.replace(new RegExp(`^/${localeInPathname}`), '')
    : pathname;

  const pagePath =
    pathnameWithoutLocale && pathnameWithoutLocale !== '/'
      ? pathnameWithoutLocale
      : '/home';

  const canonicalPathname = `/${locale}${pagePath}`;

  if (pathname !== canonicalPathname) {
    return NextResponse.redirect(new URL(canonicalPathname, request.url));
  }
}

export const config = {
  // Every path except files (anything with a dot), Next.js internals and API routes
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};
