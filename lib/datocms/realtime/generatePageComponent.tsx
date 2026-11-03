import type { TadaDocumentNode } from 'gql.tada';
import { ViewTransition } from 'react';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { executeQuery } from '../executeQuery';
import {
  type AsyncPageProps,
  type BuildVariablesFn,
  resolveRouteContext,
} from '../routeContext';
import type { ContentPage, RealtimeComponent } from './types';

type Options<PageProps extends ResolvedGlobalPageProps, Result, Variables> = {
  /** The route's GraphQL query (its meta.ts) */
  query: TadaDocumentNode<Result, Variables>;
  /** Turns the route params into the query variables */
  buildVariables?: BuildVariablesFn<PageProps, Variables>;
  /** Renders the page from the query result (its Content.tsx) */
  contentComponent: ContentPage<PageProps, Result>;
  /** The client version of contentComponent used in Draft Mode (its RealTime.tsx) */
  realtimeComponent: RealtimeComponent<PageProps, Result, Variables>;
  /** Layouts persist across navigations, so only pages fade; the two layouts pass false */
  pageTransition?: boolean;
};

/**
 * Builds the Next.js page (or layout) component for a DatoCMS-backed route.
 *
 * It runs the route's query, then renders:
 * - with Draft Mode off: `contentComponent` on the server, with the published
 *   content, cached until DatoCMS reports a change;
 * - with Draft Mode on: `realtimeComponent`, a client component that receives
 *   draft content and re-renders through the Real-time Updates API as editors
 *   type, without a page reload.
 */
export function generatePageComponent<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
>(options: Options<PageProps, Result, Variables>) {
  return async function Page(asyncPageProps: AsyncPageProps) {
    const { pageProps, variables, includeDrafts } = await resolveRouteContext(
      asyncPageProps,
      options.buildVariables,
    );

    const data = await executeQuery(options.query, {
      variables,
      includeDrafts,
    });

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    const page = includeDrafts ? (
      <RealTime
        token={process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!}
        baseEditingUrl={process.env.DATOCMS_BASE_EDITING_URL!}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );

    if (options.pageTransition === false) return page;

    // Navigations fade one page out and the next in (styles/components/motion.css);
    // refreshes and draft updates stay still
    return (
      <ViewTransition enter="page-enter" exit="page-exit" default="none">
        {page}
      </ViewTransition>
    );
  };
}
