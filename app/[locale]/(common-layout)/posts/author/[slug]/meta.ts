import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
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
    query AuthorQuery(
      $slug: String
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
      $skip: IntType = "0"
    ) {
      author(filter: { slug: { eq: $slug } }, locale: $locale) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        picture {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        bio
        description
        _allReferencingPosts(
          filter: { title: { isBlank: "false" } }
          orderBy: _createdAt_DESC
          first: 100
          locale: $locale
          fallbackLocales: $fallbackLocale
          skip: $skip
        ) {
          id
          ...PostExcerptFragment
        }
        _allReferencingPostsMeta(
          locale: $locale
          filter: { title: { isBlank: "false" } }
        ) {
          count
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PostExcerptFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
