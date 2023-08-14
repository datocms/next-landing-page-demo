import {
  request as graphqlRequest,
  RequestDocument,
  Variables,
} from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/esm/types';

export default async function queryDatoCMS<
  TDocument = any,
  TVariables = Record<string, any>
>(
  document: RequestDocument | TypedDocumentNode<TDocument, TVariables>,
  variables?: TVariables,
  isDraft?: boolean
) {
  const headers: GraphQLClientRequestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (isDraft) {
    headers['X-Include-Drafts'] = 'true';
  }

  return graphqlRequest<TDocument, Variables>(
    'https://graphql.datocms.com/',
    document,
    variables as Variables,
    headers
  );
}
