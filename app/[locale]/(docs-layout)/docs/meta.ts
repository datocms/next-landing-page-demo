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
      $fallbackLocales: [SiteLocale!]
    ) {
      documentationHome(locale: $locale, fallbackLocales: $fallbackLocales) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        title
        subtitle
        ...FeaturedDocumentationPagesFragment
      }
      # The overview of the docs by section: each top-level page with its
      # subpages (three levels, flattened on the page)
      allDocumentationPages(
        filter: { parent: { exists: "false" } }
        locale: $locale
        fallbackLocales: $fallbackLocales
      ) {
        id
        slug
        title
        subtitle
        children {
          id
          slug
          title
          children {
            id
            slug
            title
            children {
              id
              slug
              title
            }
          }
        }
      }
    }
  `,
  [TagFragment, FeaturedDocumentationPagesFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
