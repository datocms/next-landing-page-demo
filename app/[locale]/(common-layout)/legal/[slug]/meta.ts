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
    query LegalQuery(
      $slug: String
      $locale: SiteLocale
      $fallbackLocales: [SiteLocale!]
    ) {
      legalPage(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocales
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
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
