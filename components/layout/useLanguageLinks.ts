'use client';

import { usePathname } from 'next/navigation';
import type { SiteLocale } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { buildUrl } from '@/utils/globalPageProps';

/** Each locale's name in its own language, capitalized for menus ("italiano" → "Italiano") */
const nativeLanguageName = (locale: SiteLocale) => {
  const languageTag = locale.replaceAll('_', '-');
  const name =
    new Intl.DisplayNames([languageTag], { type: 'language' }).of(
      languageTag,
    ) ?? languageTag;
  return name.charAt(0).toLocaleUpperCase(languageTag) + name.slice(1);
};

/**
 * The current page in every locale (the locale prefix of the path swapped),
 * shared by the header's language selector, the mobile menu and the footer
 */
export function useLanguageLinks(
  globalPageProps: ResolvedGlobalPageProps,
  languages: SiteLocale[],
) {
  const currentLocale = globalPageProps.params.locale;
  const pathname = usePathname();
  const pathnameWithoutPrefix = pathname.replace(
    new RegExp(`^\\/${currentLocale}`),
    '',
  );

  return {
    currentLanguageName: nativeLanguageName(currentLocale),
    links: languages.map((locale) => ({
      locale,
      /** BCP 47 tag for hrefLang and lang */
      tag: locale.replaceAll('_', '-'),
      name: nativeLanguageName(locale),
      href: buildUrl({ params: { locale } }, pathnameWithoutPrefix),
      current: locale === currentLocale,
    })),
  };
}
