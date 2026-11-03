import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAvailableLocales, getFallbackLocale } from '@/lib/i18n/locales';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import type { SiteLocale } from './graphql';

/** The props Next.js passes to a page or layout: params arrive as a promise, the locale as a plain string */
export type AsyncPageProps = {
  params: Promise<{ locale: string; [key: string]: string | number }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  children?: React.ReactNode;
};

/** Builds a route's GraphQL variables from its resolved params */
export type BuildVariablesFn<
  PageProps extends ResolvedGlobalPageProps,
  Variables = Record<string, unknown>,
> = (context: PageProps & { fallbackLocale: SiteLocale }) => Variables;

/**
 * Everything a DatoCMS-backed route needs before it can query: awaited params
 * with a validated locale (an unknown locale is a 404), the query variables,
 * and whether the visitor is in Draft Mode.
 */
export async function resolveRouteContext<
  PageProps extends ResolvedGlobalPageProps,
  Variables,
>(
  asyncPageProps: AsyncPageProps,
  buildVariables?: BuildVariablesFn<PageProps, Variables>,
) {
  const params = await asyncPageProps.params;
  const locales = await getAvailableLocales();
  if (!locales.includes(params.locale as SiteLocale)) {
    notFound();
  }

  // searchParams is left out: props passed to the client (RealTime) must be serializable
  const {
    params: _params,
    searchParams: _searchParams,
    ...rest
  } = asyncPageProps;
  const pageProps = {
    ...rest,
    params: { ...params, locale: params.locale as SiteLocale },
  } as unknown as PageProps;

  const fallbackLocale = await getFallbackLocale();
  const variables =
    buildVariables?.({ ...pageProps, fallbackLocale }) ?? ({} as Variables);
  const { isEnabled: includeDrafts } = await draftMode();

  return { pageProps, variables, includeDrafts };
}
