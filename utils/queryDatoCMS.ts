import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  apiToken: string,
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  if (!apiToken) {
    throw new Error('Missing DatoCMS API token!');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${apiToken}`,
  };

  if (isDraft) headers['X-Include-Drafts'] = 'true';

  const response = await fetch('https://graphql.datocms.com/', {
    cache: 'force-cache',
    method: 'POST',
    headers,
    body: JSON.stringify({ query: print(document), variables }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Invalid status code: ${response.status}\n${body}`);
  }

  const body = (await response.json()) as
    | { data: TResult }
    | { errors: unknown[] };

  if ('errors' in body) {
    throw new Error(`Invalid GraphQL request: ${body.errors}`);
  }

  return body.data;
}
