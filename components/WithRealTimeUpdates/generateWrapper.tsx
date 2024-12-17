import getAvailableLocales, { getFallbackLocale } from '@/app/i18n/settings';
import { SiteLocale } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(unsanitizedPageProps: PageProps) {
    const allLocales = await getAvailableLocales();
    if (!allLocales.includes(unsanitizedPageProps?.params?.locale)) {
      notFound();
    }

    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = draftMode();

    const { searchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps as PageProps & { searchParams: unknown };

    const pageProps = pagePropsWithoutSearchParams as unknown as PageProps;

    const variables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    return isDraft ? (
      <RealTime
        token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );
  };
}
