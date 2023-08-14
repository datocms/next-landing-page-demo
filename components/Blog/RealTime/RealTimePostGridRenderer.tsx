'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import PostGridRenderer from '../PostGridRenderer';
import {
  PostsQuery,
  PostsQueryVariables,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimePostGridRenderer({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: PostsQuery;
  query: TypedDocumentNode<PostsQuery>;
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

  return <PostGridRenderer lng={locale} data={data} />;
}
