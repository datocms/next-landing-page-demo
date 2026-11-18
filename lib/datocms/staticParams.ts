/*
 * Nothing is prerendered at build time: each demo project of try.datocms.com
 * has its own content and API token, which arrive with the visitor's request
 * (see apiToken.ts). Every page renders on demand instead.
 */

/** `{ locale }` for each locale: routes whose only parameter is the locale */
export async function localeParams(): Promise<{ locale: string }[]> {
  return [];
}

/** `{ locale, slug }` for each record of a collection, in each locale */
export async function slugParams(
  _collection: 'docs' | 'authors' | 'changelog' | 'tags' | 'legal',
): Promise<{ locale: string; slug: string }[]> {
  return [];
}

/** `{ locale, page }` for the posts list's pages after the first */
export async function postPageParams(): Promise<
  { locale: string; page: string }[]
> {
  return [];
}
