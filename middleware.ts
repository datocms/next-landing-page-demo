import getAvailableLocales from '@/app/i18n/settings';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import type { SiteLocale } from './graphql/types/graphql';
import {
  type GlobalPageProps,
  buildUrl as buildUrlForPage,
} from './utils/globalPageProps';

async function findBestLocaleForVisitor(
  request: Request,
  locales: SiteLocale[],
) {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages();

  return match(languages, locales, locales[0]) as SiteLocale;
}

function buildUrl(apiToken: string, locale: SiteLocale, path: string) {
  const simulatedPageProps: GlobalPageProps = {
    params: {
      locale,
      apiToken,
    },
  };

  return buildUrlForPage(simulatedPageProps, path);
}

export async function middleware(request: NextRequest) {
  const { pathname: pathnameWithApiToken } = request.nextUrl;

  const apiToken = pathnameWithApiToken.match(/^\/([^\/$]+)/)?.[1];

  if (!apiToken) {
    return NextResponse.redirect(new URL('/no-api-token', request.url));
  }

  const pathname = pathnameWithApiToken.replace(
    new RegExp(`^/${apiToken}`),
    '',
  );

  const locales = await getAvailableLocales(apiToken);

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
    apiToken,
    normalizedLocale,
    normalizedPathnameWithoutLocale,
  );

  if (pathnameWithApiToken !== normalizedPathname) {
    return NextResponse.redirect(new URL(normalizedPathname, request.url));
  }
}

export const config = {
  matcher: ['/((?!.*\\.|_next|api\\/|no-api-token).*)'],
};
