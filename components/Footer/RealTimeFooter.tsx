'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import FooterRenderer from './FooterRenderer';
import {
  FooterQuery,
  FooterQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimeFooter({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: FooterQuery;
  query: TypedDocumentNode<FooterQuery>;
  variables: FooterQueryVariables;
}) {
  const { data, error, status } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <FooterRenderer lng={locale} data={data} />;
}
