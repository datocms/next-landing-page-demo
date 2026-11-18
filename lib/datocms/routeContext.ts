import { draftMode } from 'next/headers';
import { getFallbackLocale, requireSiteLocale } from '@/lib/i18n/locales';
import type {
  GlobalPageProps,
  ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import type { SiteLocale } from './graphql';

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
  asyncPageProps: GlobalPageProps,
  buildVariables?: BuildVariablesFn<PageProps, Variables>,
) {
  const params = await asyncPageProps.params;
  const locale = await requireSiteLocale(params.locale);

  // searchParams is left out: props passed to the client (RealTime) must be serializable
  const {
    params: _params,
    searchParams: _searchParams,
    ...rest
  } = asyncPageProps;
  const pageProps = {
    ...rest,
    params: { ...params, locale },
  } as unknown as PageProps;

  const fallbackLocale = await getFallbackLocale();
  const variables =
    buildVariables?.({ ...pageProps, fallbackLocale }) ?? ({} as Variables);
  const { isEnabled: includeDrafts } = await draftMode();

  return { pageProps, variables, includeDrafts };
}
