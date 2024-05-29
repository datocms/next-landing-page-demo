'use client';

import DocumentationPageRenderer from '@/components/Documentation/DocumentationPageRenderer';
import type {
  DocumentationPageQuery,
  DocumentationPageQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

export default function RealTimeDocumentationPage({
  locale,
  initialData,
  token,
  query,
  variables,
}: {
  locale: SiteLocale;
  token: string;
  initialData: DocumentationPageQuery;
  query: TypedDocumentNode<DocumentationPageQuery>;
  variables: DocumentationPageQueryVariables;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return <></>;

  return <DocumentationPageRenderer data={data} />;
}
