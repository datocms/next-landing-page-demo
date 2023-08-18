import {
  request as graphqlRequest,
  RequestDocument,
  Variables,
} from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/esm/types';
import { ASTNode, print } from 'graphql';

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

  if (isDraft) {
    headers['X-Include-Drafts'] = 'true';
  }

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
