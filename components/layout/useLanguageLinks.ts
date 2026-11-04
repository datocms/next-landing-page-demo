'use client';

import { usePathname } from 'next/navigation';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { toLanguageTag } from '@/lib/i18n/languageTag';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { buildUrl } from '@/utils/routes';

/** Each locale's name in its own language, capitalized for menus ("italiano" → "Italiano") */
const nativeLanguageName = (locale: SiteLocale) => {
  const languageTag = toLanguageTag(locale);
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
      tag: toLanguageTag(locale),
      name: nativeLanguageName(locale),
      href: buildUrl({ params: { locale } }, pathnameWithoutPrefix),
      current: locale === currentLocale,
    })),
  };
}
