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
      $fallbackLocales: [SiteLocale!]
    ) {
      author(filter: { slug: { eq: $slug } }, locale: $locale) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        name
        picture {
          focalPoint {
            x
            y
          }
          responsiveImage(
            imgixParams: {
              w: "192"
              h: "192"
              fit: crop
              crop: focalpoint
              # The avatars are drawn as busts: small crops zoom in on the head
              fpZ: 1.5
              auto: format
            }
          ) {
            ...ResponsiveImageFragment
          }
        }
        role
        description {
          value
        }
        areasOfInterest {
          id
          label
        }
        _allReferencingPosts(
          filter: { title: { isBlank: "false" } }
          orderBy: _createdAt_DESC
          first: 100
          locale: $locale
          fallbackLocales: $fallbackLocales
        ) {
          id
          ...PostExcerptFragment
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PostExcerptFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
