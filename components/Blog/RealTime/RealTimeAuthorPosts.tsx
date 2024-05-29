'use client';

import AuthorPosts from '@/components/Blog/AuthorPosts';
import type {
  AuthorQuery,
  AuthorQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

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
