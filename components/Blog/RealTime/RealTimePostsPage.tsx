'use client';

import PostsPage from '@/components/Blog/PostsPage';
import type {
  PostsQuery,
  PostsQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

export default function RealTimePostsPage({
  locale,
  initialData,
  token,
  query,
  page,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: PostsQuery;
  query: TypedDocumentNode<PostsQuery, PostsQueryVariables>;
  page: number;
  variables: PostsQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <PostsPage lng={locale} data={data} page={page} />;
}
