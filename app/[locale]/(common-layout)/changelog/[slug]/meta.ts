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
      $fallbackLocales: [SiteLocale!]
    ) {
      changelogEntry(
        filter: { slug: { eq: $slug } }
        locale: $locale
        fallbackLocales: $fallbackLocales
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
      # Every release, newest first: the neighbours of this one, and whether it is the latest
      releases: allChangelogEntries(
        locale: $locale
        fallbackLocales: $fallbackLocales
        orderBy: [timeOfRelease_DESC]
        first: 100
      ) {
        id
        slug
        versionName
        timeOfRelease
      }
    }
  `,
  [TagFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
