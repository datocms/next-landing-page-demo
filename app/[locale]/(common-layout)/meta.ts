import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  children: React.ReactNode;
};

export const query = graphql(
  /* GraphQL */ `
    query CommonLayoutQuery($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      layout(locale: $locale, fallbackLocales: $fallbackLocale) {
        logo {
          url
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        menu {
          ... on MenuItemRecord {
            id
            title
            __typename
            page {
              slug
            }
          }
          ... on MenuDropdownRecord {
            id
            title
            __typename
            items {
              ... on MenuItemRecord {
                id
                title
                __typename
                page {
                  slug
                }
              }
            }
          }
        }
        notification {
          value
        }
        footerSubtitle {
          value
        }
        footerLogo {
          url
          height
          width
        }
        socialMediaLinks {
          url
          name
          id
          icon {
            url
            height
            width
          }
        }
        footerLinks {
          ... on LegalPageRecord {
            id
            slug
            title
          }
        }
      }
      _site {
        locales
      }
    }
  `,
  [ResponsiveImageFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
