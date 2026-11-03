import { FeaturedDocumentationPagesFragment } from '@/components/docs/FeaturedDocumentationPages/fragment';
import { TagFragment } from '@/lib/datocms/commonFragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query DocumentationHomePageQuery(
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
    ) {
      documentationHome(locale: $locale, fallbackLocales: $fallbackLocale) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        subheader
        ...FeaturedDocumentationPagesFragment
      }
    }
  `,
  [TagFragment, FeaturedDocumentationPagesFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
