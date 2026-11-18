import { executeQuery as libExecuteQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';
import { getApiToken, getBaseEditingUrl } from './apiToken';

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  /** Read draft content (Draft Mode) instead of the published one */
  includeDrafts?: boolean;
  /** The project's API token; defaults to the one of the current request */
  apiToken?: string;
};

/**
 * Runs a GraphQL query against the DatoCMS Content Delivery API, with the API
 * token of the demo project the visitor came from (see apiToken.ts).
 *
 * Nothing is cached: demo projects have no webhook to tell this site when
 * their content changes, and every visitor edits a different project.
 *
 * With `includeDrafts`, the query also reads draft content and turns on
 * Content Link: text fields then carry invisible stega markers, so editors can
 * hold Alt/Option and click any text to open the matching field in DatoCMS.
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
): Promise<Result> {
  const includeDrafts = options?.includeDrafts;
  const token = options?.apiToken ?? (await getApiToken());
  const baseEditingUrl = includeDrafts
    ? await getBaseEditingUrl(token)
    : undefined;

  return libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts,
    token,
    ...(baseEditingUrl ? { contentLink: 'v1' as const, baseEditingUrl } : {}),
    requestInitOptions: { cache: 'no-store' },
  });
}
