import { cache } from 'react';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql, type SiteLocale } from '@/lib/datocms/graphql';
import { getFallbackLocale } from '@/lib/i18n/locales';
import { en } from './en';
import { registerUiStrings } from './index';
import type { Dictionary, UiStringKey } from './types';

const query = graphql(/* GraphQL */ `
  query InterfaceTextQuery($locale: SiteLocale, $fallbackLocales: [SiteLocale!]) {
    interfaceText(locale: $locale, fallbackLocales: $fallbackLocales) {
      skipToContent
      home
      menu
      openMenu
      closeMenu
      announcement
      opensInNewTab
      mainNavigation
      otherItems
      currentLanguage
      ratingOutOf
      latestPosts
      postsBy
      postCountOne
      postCountOther
      pageOf
      noTaggedPosts
      pagination
      untitled
      allPosts
      allAuthors
      morePosts
      writtenBy
      taggedPostCountOne
      taggedPostCountOther
      featuredPosts
      tags
      share
      shareOn
      copyLink
      copied
      shareOther
      copy
      copyCode
      openDocsMenu
      closeDocsMenu
      onThisPage
      documentation
      backToSite
      latest
      docsHome
      docsBadge
      featuredPages
      inThisTopic
      allTopics
      previousPage
      nextPage
      docsPagination
      changelog
      released
      lastUpdated
      legal
      social
      language
      emailAddress
      emailPlaceholder
      subscribe
      invalidEmail
      subscribed
      notFoundTitle
      notFoundBody
      backToHome
      enterDraftMode
      exitDraftMode
      authenticate
      draftPasswordHint
      password
      wrongPassword
      cancel
      draftModeOn
      draftModeOnBody
      dismiss
      testimonials
      brands
      video
      videoPlayer
      playVideo
      playVideoTitled
      closeVideo
      pricing
      choosePlan
      notIncluded
      billingPeriod
      monthly
      yearly
      showingMonthlyPrices
      showingYearlyPrices
      perMonth
      perYear
      plans
      comparePlans
      feature
      included
      excluded
      getOnAppStore
      getOnGooglePlay
    }
  }
`);

/** The record's fields by name; a missing or empty field is treated as absent */
type Fields = Record<string, string | null | undefined>;

/** The record's text for `name`, or undefined when it is empty */
function textOf(fields: Fields, name: string): string | undefined {
  const value = fields[name];
  return value ? value : undefined;
}

/**
 * Turns the record into a dictionary: each key reads the field of the same
 * name, a plural key reads its two fields (`postCountOne`, `postCountOther`),
 * and anything empty keeps the English text
 */
function toDictionary(fields: Fields): Dictionary {
  const dictionary: Record<string, unknown> = {};

  for (const key of Object.keys(en) as UiStringKey[]) {
    const fallback = en[key];

    if (typeof fallback === 'string') {
      dictionary[key] = textOf(fields, key) ?? fallback;
    } else {
      dictionary[key] = {
        one: textOf(fields, `${key}One`) ?? fallback.one,
        other: textOf(fields, `${key}Other`) ?? fallback.other,
      };
    }
  }

  return dictionary as Dictionary;
}

/**
 * The interface texts for `locale`, read from the Interface Text record in a
 * single query. Cached per request, so every caller shares one fetch.
 */
export const loadUiStrings = cache(
  async (locale: SiteLocale, includeDrafts: boolean): Promise<Dictionary> => {
    const fallbackLocale = await getFallbackLocale();
    const data = await executeQuery(query, {
      variables: { locale, fallbackLocales: [fallbackLocale] },
      includeDrafts,
    });

    return toDictionary((data.interfaceText ?? {}) as Fields);
  },
);

/**
 * Loads the texts and puts them in the request store, so uiString finds them
 * in Server Components and in the server render of Client Components.
 * Returns the dictionary, for the provider that hands it to the browser.
 */
export async function primeUiStrings(
  locale: SiteLocale,
  includeDrafts: boolean,
): Promise<Dictionary> {
  const dictionary = await loadUiStrings(locale, includeDrafts);
  registerUiStrings('request', locale, dictionary);
  return dictionary;
}
