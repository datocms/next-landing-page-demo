'use client';

import TagPosts from '@/components/Blog/TagPosts';
import type {
  SiteLocale,
  TagQuery,
  TagQueryVariables,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

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
