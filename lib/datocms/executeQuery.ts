import { executeQuery as libExecuteQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';

/** Published-content requests are stored in the Next.js Data Cache under this tag */
export const DATOCMS_CACHE_TAG = 'datocms';

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  /** Read draft content (Draft Mode) instead of the published one */
  includeDrafts?: boolean;
};

/**
 * Runs a GraphQL query against the DatoCMS Content Delivery API.
 *
 * Published content is cached in the Next.js Data Cache (`cache: 'force-cache'`),
 * so regular visitors don't cause extra calls to DatoCMS; Draft Mode requests
 * skip the cache.
 *
 * When content changes, DatoCMS calls the /api/revalidateCache webhook, which
 * invalidates every request tagged with `DATOCMS_CACHE_TAG`. One tag for
 * everything is the simplest strategy; larger sites can tag each query with the
 * records it uses (https://www.datocms.com/docs/next-js/using-cache-tags).
 *
 * With `includeDrafts`, the query uses the draft-content token and turns on
 * Content Link: text fields then carry invisible stega markers, so editors can
 * hold Alt/Option and click any text to open the matching field in DatoCMS.
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
): Promise<Result> {
  const includeDrafts = options?.includeDrafts;

  return libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts,
    token: includeDrafts
      ? process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!
      : process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    ...(includeDrafts
      ? {
          contentLink: 'v1' as const,
          baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
        }
      : {}),
    requestInitOptions: {
      cache: 'force-cache',
      next: { tags: [DATOCMS_CACHE_TAG] },
    },
  });
}
