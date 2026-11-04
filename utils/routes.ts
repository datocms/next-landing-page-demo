import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

/** A site path in the current locale: buildUrl(props, '/posts') is '/en/posts' */
export function buildUrl(
  globalPageProps: ResolvedGlobalPageProps,
  path?: string,
) {
  return `/${globalPageProps.params.locale}${path || ''}`;
}

// The URL of each routable DatoCMS model, matching the route folders in app/[locale]/

export function pageUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/${slug}`);
}

export function postUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/posts/${slug}`);
}

export function authorUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/posts/author/${slug}`);
}

export function tagUrl(globalPageProps: ResolvedGlobalPageProps, slug: string) {
  return buildUrl(globalPageProps, `/posts/tag/${slug}`);
}

export function docsHomeUrl(globalPageProps: ResolvedGlobalPageProps) {
  return buildUrl(globalPageProps, '/docs');
}

export function docsPageUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/docs/${slug}`);
}

export function legalPageUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/legal/${slug}`);
}

export function changelogUrl(
  globalPageProps: ResolvedGlobalPageProps,
  slug: string,
) {
  return buildUrl(globalPageProps, `/changelog/${slug}`);
}

/** A blog index page: page 1 is the `posts` page record, the rest /posts/page/[page] */
export function postsPageUrl(
  globalPageProps: ResolvedGlobalPageProps,
  page: number,
) {
  return page === 1
    ? pageUrl(globalPageProps, 'posts')
    : buildUrl(globalPageProps, `/posts/page/${page}`);
}
