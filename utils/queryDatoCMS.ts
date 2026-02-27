import { executeQuery } from '@datocms/cda-client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import getBaseEditingUrl from './getBaseEditingUrl';

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>
>(
  apiToken: string,
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean
): Promise<TResult> {
  // Content Link needs the admin URL. Without it, the API returns an error.
  const baseEditingUrl = isDraft ? await getBaseEditingUrl(apiToken) : undefined;

  return executeQuery(document, {
    token: apiToken,
    excludeInvalid: true,
    includeDrafts: isDraft,
    ...(baseEditingUrl
      ? {
          contentLink: 'v1' as const,
          baseEditingUrl,
        }
      : {}),
    variables,
    requestInitOptions: {
      cache: 'force-cache',
      next: { tags: ['datocms'] },
    },
  });
}
