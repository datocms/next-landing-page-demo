import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import {
  API_TOKEN_COOKIE,
  API_TOKEN_HEADER,
  isApiToken,
} from '@/lib/datocms/apiToken';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { fromLanguageTag, toLanguageTag } from '@/lib/i18n/languageTag';
import { getAvailableLocales } from '@/lib/i18n/locales';

// Fetch caching has no effect in Proxy, so keep each project's locales in
// memory for a minute instead of querying DatoCMS on every request (a failed
// lookup is retried on the next request)
const LOCALES_TTL_MS = 60_000;

const cachedLocales = new Map<
  string,
  { locales: Promise<SiteLocale[]>; expireAt: number }
>();

function getCachedLocales(apiToken: string) {
  const cached = cachedLocales.get(apiToken);
  if (cached && Date.now() <= cached.expireAt) return cached.locales;

  const locales = getAvailableLocales(apiToken).catch((error) => {
    cachedLocales.delete(apiToken);
    throw error;
  });
  cachedLocales.set(apiToken, {
    locales,
    expireAt: Date.now() + LOCALES_TTL_MS,
  });
  return locales;
}

/**
 * The project locale that best matches the browser's Accept-Language header
 * (the first locale when nothing matches), compared as language tags.
 */
function findBestLocaleForVisitor(
  request: Request,
  locales: SiteLocale[],
): SiteLocale {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', toLanguageTag(acceptLanguage));
  }

  const languageTags = locales.map(toLanguageTag);
  const languages = new Negotiator({
    headers: Object.fromEntries(headers.entries()),
  }).languages(languageTags);
  const bestMatch = match(languages, languageTags, languageTags[0]);

  return fromLanguageTag(bestMatch);
}

/**
 * Every demo project of try.datocms.com shares this site, and the visitor's API
 * token picks the project (see lib/datocms/apiToken.ts). A URL that starts with
 * a token (`/<token>/en/home`) stores it in a cookie and redirects to the same
 * page without it; every other request reads the cookie. The token then
 * reaches the page in a request header.
 *
 * Every page URL also starts with one of the project's locales. A URL without
 * one gets the visitor's best match, and a bare locale (or the site root) leads
 * to its home page. For an English-speaking visitor: `/` → `/en/home`,
 * `/pricing` → `/en/pricing`, `/it` → `/it/home`.
 */
export default async function proxy(request: NextRequest) {
  const [, firstSegment] = request.nextUrl.pathname.split('/');
  const tokenInPathname = isApiToken(firstSegment) ? firstSegment : undefined;

  const pathname = tokenInPathname
    ? request.nextUrl.pathname.slice(tokenInPathname.length + 1) || '/'
    : request.nextUrl.pathname;

  const apiToken = [
    tokenInPathname,
    request.headers.get(API_TOKEN_HEADER) ?? undefined,
    request.cookies.get(API_TOKEN_COOKIE)?.value,
  ].find(isApiToken);

  if (!apiToken) {
    return new NextResponse(
      'This website shows the content of a DatoCMS demo project. Open it from your project on https://try.datocms.com.',
      { status: 404 },
    );
  }

  const locales = await getCachedLocales(apiToken);

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

  if (request.nextUrl.pathname !== canonicalPathname) {
    const url = new URL(canonicalPathname, request.url);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url);

    if (tokenInPathname) {
      // Partitioned and SameSite=None, so it also works inside the iframe of
      // the Web Previews plugin, where this site is a third party
      response.cookies.set({
        name: API_TOKEN_COOKIE,
        value: tokenInPathname,
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'none',
        partitioned: true,
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(API_TOKEN_HEADER, apiToken);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Every path except files (anything with a dot), Next.js internals and API routes
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};
