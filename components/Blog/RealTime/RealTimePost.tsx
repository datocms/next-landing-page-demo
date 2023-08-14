'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Post from '../Post/Post';
import { PostQuery, PostQueryVariables, SiteLocale } from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimePost({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: PostQuery;
  query: TypedDocumentNode<PostQuery>;
  variables: PostQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <Post lng={locale} data={data} />;
}
