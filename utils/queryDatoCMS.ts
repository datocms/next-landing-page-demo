import { executeQuery } from '@datocms/cda-client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  return executeQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN!,
    excludeInvalid: true,
    includeDrafts: isDraft,
    ...(isDraft
      ? {
          contentLink: 'v1' as const,
          baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
        }
      : {}),
    variables,
    requestInitOptions: {
      cache: 'force-cache',
      next: { tags: ['datocms'] },
    },
  });
}
