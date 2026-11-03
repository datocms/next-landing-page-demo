import type { SiteLocale } from '@/lib/datocms/graphql';

/** Page props once the params are awaited and the locale is known to be one of the project's */
export type ResolvedGlobalPageProps = {
  params: { locale: SiteLocale };
};

/** A site path in the current locale: buildUrl(props, '/posts') is '/en/posts' */
export function buildUrl(
  globalPageProps: ResolvedGlobalPageProps,
  path?: string,
) {
  return `/${globalPageProps.params.locale}${path || ''}`;
}
