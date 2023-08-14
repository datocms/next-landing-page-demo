'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import AuthorPosts from '../AuthorPosts';
import {
  AuthorQuery,
  AuthorQueryVariables,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimeAuthorPosts({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: AuthorQuery;
  query: TypedDocumentNode<AuthorQuery, AuthorQueryVariables>;
  variables: AuthorQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });
  if (!data) return <></>;

  return <AuthorPosts lng={locale} data={data} />;
}
