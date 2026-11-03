import { AppCtaFragment } from '@/components/blocks/AppCta/fragment';
import { CtaButtonWithImageFragment } from '@/components/blocks/CtaButtonWithImage/fragment';
import { ImageBlockFragment } from '@/components/blocks/ImageBlock/fragment';
import { NewsletterSubscriptionFragment } from '@/components/blocks/NewsletterSubscription/fragment';
import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
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
    query PostQuery($slug: String, $locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      post(
        filter: { slug: { eq: $slug }, title: { isBlank: "false" } }
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        _publishedAt
        title
        author {
          name
          bio
          slug
          picture {
            responsiveImage(imgixParams: { w: "64", h: "64", fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
        }
        tags {
          id
          tag
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
    }
  `,
  [
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
