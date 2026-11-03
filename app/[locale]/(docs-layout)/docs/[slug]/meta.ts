import { TagFragment } from '@/lib/datocms/commonFragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    slug: string;
  };
};

export const query = graphql(
  /* GraphQL */ `
    query DocumentationPageQuery(
      $slug: String
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
    ) {
      documentationPage(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        __typename
        id
        content {
          value
        }
      }
    }
  `,
  [TagFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
