import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata } from 'next';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { executeQuery } from './executeQuery';
import {
  type AsyncPageProps,
  type BuildVariablesFn,
  resolveRouteContext,
} from './routeContext';

/**
 * Builds a route's `generateMetadata`: it runs the same query as the page and
 * turns the SEO tags DatoCMS returns (`_seoMetaTags`) into Next.js metadata.
 * Outside Draft Mode the second run is answered by the Data Cache.
 */
export function generateMetadataFn<
  PageProps extends ResolvedGlobalPageProps,
  Result = unknown,
  Variables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<Result, Variables>;
  buildVariables?: BuildVariablesFn<PageProps, Variables>;
  /** Picks the SEO tags out of the query result */
  generate: (
    data: Result,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;
}) {
  return async function generateMetadata(
    asyncPageProps: AsyncPageProps,
  ): Promise<Metadata> {
    const { variables, includeDrafts } = await resolveRouteContext(
      asyncPageProps,
      options.buildVariables,
    );

    const data = await executeQuery(options.query, {
      variables,
      includeDrafts,
    });
    const tags = options.generate(data);

    return tags ? toNextMetadata(tags) : {};
  };
}
