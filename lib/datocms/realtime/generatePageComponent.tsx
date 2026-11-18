import type { TadaDocumentNode } from 'gql.tada';
import PageTransition from '@/components/layout/PageTransition';
import { primeUiStrings } from '@/lib/i18n/uiStrings/load';
import type {
  GlobalPageProps,
  ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';
import { getApiToken, getBaseEditingUrl } from '../apiToken';
import { executeQuery } from '../executeQuery';
import { type BuildVariablesFn, resolveRouteContext } from '../routeContext';
import type { ContentComponent, RealtimeComponent } from './types';

type Options<PageProps extends ResolvedGlobalPageProps, Result, Variables> = {
  /** The route's GraphQL query (its meta.ts) */
  query: TadaDocumentNode<Result, Variables>;
  /** Turns the route params into the query variables */
  buildVariables?: BuildVariablesFn<PageProps, Variables>;
  /** Renders the page from the query result (its Content.tsx) */
  contentComponent: ContentComponent<PageProps, Result>;
  /** The client version of contentComponent used in Draft Mode (its RealTime.tsx) */
  realtimeComponent: RealtimeComponent<PageProps, Result, Variables>;
  /**
   * Wraps the page in <PageTransition> (the default). The two layouts pass
   * false: they persist across navigations and place their own around the
   * part that changes
   */
  pageTransition?: boolean;
};

/**
 * Builds the Next.js page (or layout) component for a DatoCMS-backed route.
 *
 * It runs the route's query, then renders:
 * - with Draft Mode off: `contentComponent` on the server, with the published
 *   content;
 * - with Draft Mode on: `realtimeComponent`, a client component that receives
 *   draft content and re-renders through the Real-time Updates API as editors
 *   type, without a page reload.
 */
export function generatePageComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
>(options: Options<PageProps, Result, Variables>) {
  return async function Page(asyncPageProps: GlobalPageProps) {
    const { pageProps, variables, includeDrafts } = await resolveRouteContext(
      asyncPageProps,
      options.buildVariables,
    );

    // Fills the request store first, whatever order React renders the layouts and the page in
    await primeUiStrings(pageProps.params.locale, includeDrafts);

    const data = await executeQuery(options.query, {
      variables,
      includeDrafts,
    });

    const { realtimeComponent: RealTime, contentComponent: Content } = options;
    const apiToken = includeDrafts ? await getApiToken() : undefined;
    const baseEditingUrl = apiToken
      ? await getBaseEditingUrl(apiToken)
      : undefined;

    // Subscribes with the same draft settings executeQuery used to fetch `data`
    const page = includeDrafts ? (
      <RealTime
        pageProps={pageProps}
        query={options.query}
        variables={variables}
        initialData={data}
        token={apiToken!}
        includeDrafts
        excludeInvalid
        contentLink={baseEditingUrl ? 'v1' : undefined}
        baseEditingUrl={baseEditingUrl}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );

    if (options.pageTransition === false) return page;

    return <PageTransition>{page}</PageTransition>;
  };
}
