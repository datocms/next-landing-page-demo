'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import TagPosts from '../TagPosts';
import { SiteLocale, TagQuery, TagQueryVariables } from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimeTagPosts({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: TagQuery;
  query: TypedDocumentNode<TagQuery, TagQueryVariables>;
  variables: TagQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <TagPosts lng={locale} data={data} />;
}
