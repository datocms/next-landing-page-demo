import getAvailableLocales from '@/app/i18n/settings';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import type { SiteLocale } from './graphql/types/graphql';

async function findBestLocaleForVisitor(
  request: Request,
  locales: SiteLocale[],
): Promise<SiteLocale> {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const headersObject = Object.fromEntries(headers.entries());
  const reformattedLocales = locales.map((locale) =>
    locale.replaceAll('_', '-'),
  );
  const languages = new Negotiator({ headers: headersObject }).languages(reformattedLocales);
  const detectedLocale = match(
    languages,
    reformattedLocales,
    reformattedLocales[0],
  );
  const detectedLocaleAsSiteLocale = detectedLocale.replaceAll(
    '-',
    '_',
  ) as SiteLocale;

  return detectedLocaleAsSiteLocale;
}

function buildUrl(locale: SiteLocale, path: string) {
  return `/${locale}${path || ''}`;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locales = await getAvailableLocales();

  const localeInPathname = locales.find((locale) =>
    pathname.match(new RegExp(`^/${locale}($|/)`)),
  );

  const normalizedLocale =
    localeInPathname || (await findBestLocaleForVisitor(request, locales));

  const pathnameWithoutLocale = localeInPathname
    ? pathname.replace(new RegExp(`^/${localeInPathname}`), '')
    : pathname;

  const normalizedPathnameWithoutLocale =
    pathnameWithoutLocale && pathnameWithoutLocale !== '/'
      ? pathnameWithoutLocale
      : '/home';

  const normalizedPathname = buildUrl(
    normalizedLocale,
    normalizedPathnameWithoutLocale,
  );

  if (pathname !== normalizedPathname) {
    return NextResponse.redirect(new URL(normalizedPathname, request.url));
  }
}

export const config = {
  matcher: ['/((?!.*\\.|_next|api\\/).*)'],
};


