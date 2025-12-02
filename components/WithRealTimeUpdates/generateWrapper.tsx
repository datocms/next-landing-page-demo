import getAvailableLocales, { getFallbackLocale } from '@/app/i18n/settings';
import type { SiteLocale } from '@/graphql/types/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

// Input props from Next.js with Promise-based params (string-based locale)
type AsyncPageProps = {
  params: Promise<{ locale: string; [key: string]: string | number }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  children?: React.ReactNode;
};

export function generateWrapper<
  PageProps extends ResolvedGlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(asyncPageProps: AsyncPageProps) {
    // Await the params to get resolved values
    const rawParams = await asyncPageProps.params;
    
    const allLocales = await getAvailableLocales();
    if (!allLocales.includes(rawParams.locale as SiteLocale)) {
      notFound();
    }

    // Convert string locale to SiteLocale type (validated above)
    const resolvedParams = {
      ...rawParams,
      locale: rawParams.locale as SiteLocale,
    };

    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    // Build resolved page props (without searchParams)
    const { params, searchParams, ...restProps } = asyncPageProps;
    const pageProps = {
      ...restProps,
      params: resolvedParams,
    } as unknown as PageProps;

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
