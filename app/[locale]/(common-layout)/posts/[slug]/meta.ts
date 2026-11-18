import { AppCtaFragment } from '@/components/blocks/AppCta/fragment';
import { CtaButtonWithImageFragment } from '@/components/blocks/CtaButtonWithImage/fragment';
import { ImageBlockFragment } from '@/components/blocks/ImageBlock/fragment';
import { NewsletterSubscriptionFragment } from '@/components/blocks/NewsletterSubscription/fragment';
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
    query PostQuery($slug: String, $locale: SiteLocale, $fallbackLocales: [SiteLocale!]) {
      post(
        filter: { slug: { eq: $slug }, title: { isBlank: "false" } }
        locale: $locale
        fallbackLocales: $fallbackLocales
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        _publishedAt
        title
        coverImage {
          id
          focalPoint {
            x
            y
          }
          responsiveImage(
            imgixParams: {
              w: "2000"
              h: "1250"
              fit: crop
              crop: focalpoint
              auto: format
            }
          ) {
            ...ResponsiveImageFragment
          }
        }
        author {
          name
          role
          slug
          description {
            value
          }
          picture {
            responsiveImage(
              imgixParams: {
                w: "112"
                h: "112"
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
        }
        tags {
          id
          name
          slug
        }
        content {
          value
          links {
            ... on RecordInterface {
              id
              __typename
            }
            slug
            title
          }
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ...ImageBlockFragment
            ...AppCtaFragment
            ...NewsletterSubscriptionFragment
            ...CtaButtonWithImageFragment
          }
        }
      }
      # "More posts" under the article: the newest others
      morePosts: allPosts(
        filter: { slug: { neq: $slug }, title: { isBlank: "false" } }
        orderBy: _createdAt_DESC
        first: 3
        locale: $locale
        fallbackLocales: $fallbackLocales
      ) {
        id
        ...PostExcerptFragment
      }
    }
  `,
  [
    PostExcerptFragment,
    TagFragment,
    ResponsiveImageFragment,
    ImageBlockFragment,
    AppCtaFragment,
    NewsletterSubscriptionFragment,
    CtaButtonWithImageFragment,
  ],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
