import { postsPageCount } from '@/components/posts/postsPagination';
import { executeQuery } from '@/lib/datocms/executeQuery';
import type { SiteLocale } from '@/lib/datocms/graphql';
import { graphql } from '@/lib/datocms/graphql';
import { getAvailableLocales } from '@/lib/i18n/locales';

/*
 * The paths each route prerenders at build time, so a click on any link of the
 * site is answered from the static cache instead of rendering on demand (and
 * the page transition starts at once). A record created later still renders on
 * its first visit, then stays cached like the rest.
 */

const slugsQuery = graphql(/* GraphQL */ `
  query StaticSlugsQuery($locale: SiteLocale) {
    allDocumentationPages(first: 500, locale: $locale) {
      slug
    }
    allAuthors(first: 100, locale: $locale) {
      slug
    }
    allChangelogEntries(first: 500, locale: $locale) {
      slug
    }
    allTags(first: 500, locale: $locale) {
      slug
    }
    allLegalPages(first: 100, locale: $locale) {
      slug
    }
    _allPostsMeta(locale: $locale, filter: { title: { isBlank: "false" } }) {
      count
    }
  }
`);

type Slugs = Awaited<ReturnType<typeof slugsFor>>;
type Collection = 'docs' | 'authors' | 'changelog' | 'tags' | 'legal';

const slugsFor = async (locale: SiteLocale) => {
  const data = await executeQuery(slugsQuery, { variables: { locale } });
  const slugs = (records: readonly { slug?: string | null }[]) =>
    records.flatMap((record) => (record.slug ? [record.slug] : []));
  return {
    docs: slugs(data.allDocumentationPages),
    authors: slugs(data.allAuthors),
    changelog: slugs(data.allChangelogEntries),
    tags: slugs(data.allTags),
    legal: slugs(data.allLegalPages),
    postPages: postsPageCount(data._allPostsMeta.count),
  };
};

/** Every locale with its slugs, fetched once per build */
let all: Promise<{ locale: SiteLocale; slugs: Slugs }[]> | null = null;
const everyLocale = () => {
  all ??= getAvailableLocales().then((locales) =>
    Promise.all(
      locales.map(async (locale) => ({
        locale,
        slugs: await slugsFor(locale),
      })),
    ),
  );
  return all;
};

/** `{ locale }` for each locale: routes whose only parameter is the locale */
export async function localeParams() {
  return (await getAvailableLocales()).map((locale) => ({ locale }));
}

/** `{ locale, slug }` for each record of a collection, in each locale */
export async function slugParams(collection: Collection) {
  return (await everyLocale()).flatMap(({ locale, slugs }) =>
    slugs[collection].map((slug) => ({ locale, slug })),
  );
}

/** `{ locale, page }` for the posts list's pages after the first */
export async function postPageParams() {
  return (await everyLocale()).flatMap(({ locale, slugs }) =>
    Array.from({ length: Math.max(0, slugs.postPages - 1) }, (_, index) => ({
      locale,
      page: String(index + 2),
    })),
  );
}
