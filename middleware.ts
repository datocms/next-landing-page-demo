import { NextRequest, NextResponse } from 'next/server';
import { fallbackLng, languages as locales } from './app/i18n/settings';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: Request): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages();
  return match(languages, locales, fallbackLng);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!.*\\.|_next\\/).*)'],
};
