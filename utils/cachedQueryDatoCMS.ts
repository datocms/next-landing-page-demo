'use cache';

import { executeQuery } from '@datocms/cda-client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

/**
 * Cached version of queryDatoCMS for production use cases.
 * Uses Next.js 16 Cache Components with the "use cache" directive.
 *
 * IMPORTANT: Only use this for data that should NEVER show draft content.
 * For pages that need draft mode support, use the regular queryDatoCMS function.
 *
 * Example use cases:
 * - Static footer data
 * - Site metadata that rarely changes
 * - Public content that doesn't need preview capability
 */
export async function cachedQueryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  return executeQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN!,
    excludeInvalid: true,
    variables,
  });
}
