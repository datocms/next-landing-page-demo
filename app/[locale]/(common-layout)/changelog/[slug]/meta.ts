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
    query ChangelogQuery(
      $slug: String
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
    ) {
      changeLog(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        timeOfRelease
        versionName
        slug
        content {
          value
        }
      }
      allChangeLogs(
        orderBy: timeOfRelease_DESC
        first: 100
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        versionName
        slug
        timeOfRelease
      }
    }
  `,
  [TagFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
