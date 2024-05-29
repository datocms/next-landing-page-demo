'use client';

import Legal from '@/components/Footer/Legal/Legal';
import type {
  LegalQuery,
  LegalQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

export default function RealTimeLegal({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: LegalQuery;
  query: TypedDocumentNode<LegalQuery>;
  variables: LegalQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <Legal lng={locale} data={data} />;
}
