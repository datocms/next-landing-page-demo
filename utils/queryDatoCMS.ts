import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/esm/types';
import { print } from 'graphql';

console.log(process.env)

if (!process.env.DATOCMS_READONLY_API_TOKEN) {
  throw new Error('Missing DatoCMS API token: make sure a DATOCMS_READONLY_API_TOKEN environment variable is set.');
}

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, any>
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean
): Promise<TResult> {
  const headers: GraphQLClientRequestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (isDraft) headers['X-Include-Drafts'] = 'true';

  const { data } = await (
    await fetch('https://graphql.datocms.com/', {
      cache: 'force-cache',
      next: { tags: ['datocms'] },
      method: 'POST',
      headers,
      body: JSON.stringify({ query: print(document), variables }),
    })
  ).json();

  return data;
}
