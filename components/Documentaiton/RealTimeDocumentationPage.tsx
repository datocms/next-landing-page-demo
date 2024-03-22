'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import {
  DocumentationPageQuery,
  DocumentationPageQueryVariables,
  SiteLocale,
} from '@/graphql/types/graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import DocumentaitonPageRenderer from './DocumentationPageRenderer';

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

  return <DocumentaitonPageRenderer data={data} />;
}
