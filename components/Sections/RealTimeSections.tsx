'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Section from './Sections';
import {
  AboutQuery,
  AboutQueryVariables,
  HomeQuery,
  HomeQueryVariables,
  PageModelSectionsField,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimeSections({
  initialData,
  token,
  query,
  variables,
  locale,
}: {
  initialData: AboutQuery | HomeQuery;
  variables: AboutQueryVariables | HomeQueryVariables;
  query: TypedDocumentNode<AboutQuery | HomeQuery>;
  locale: SiteLocale;
  token: string;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data || !data.page) return <></>;

  return (
    <Section
      locale={locale}
      sections={data.page.sections as Array<PageModelSectionsField>}
    />
  );
}
