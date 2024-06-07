import { getFallbackLocale } from '@/app/i18n/settings';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  toNextMetadata,
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
} from 'react-datocms/seo';
import type { BuildVariablesFn } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;
}) {
  return async function generateMetadata(
    pageProps: PageProps,
  ): Promise<Metadata> {
    const fallbackLocale = await getFallbackLocale(pageProps.params.apiToken);
    const { isEnabled: isDraft } = draftMode();

    const variables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(
      pageProps.params.apiToken,
      options.query,
      variables,
      isDraft,
    );

    const tags = await options.generate(data);

    return tags ? toNextMetadata(tags) : {};
  };
}
