import { getFallbackLocale } from '@/app/i18n/settings';
import type { SiteLocale } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;

  buildVariables?: (
    context: PageProps & {
      fallbackLocale: SiteLocale;
    },
  ) => TVariables;

  generate: (data: TResult) => Promise<TitleMetaLinkTag[] | SeoOrFaviconTag[]>;
}) {
  return async function Page(pageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = draftMode();

    const variables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    return toNextMetadata(await options.generate(data));
  };
}
