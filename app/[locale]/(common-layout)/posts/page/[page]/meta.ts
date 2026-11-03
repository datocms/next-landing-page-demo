import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = ResolvedGlobalPageProps & {
  params: {
    page: number;
  };
};

export const query = graphql(
  /* GraphQL */ `
    query PostsQuery(
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
      $first: IntType
      $skip: IntType = "0"
    ) {
      allPosts(
        filter: { title: { isBlank: "false" } }
        orderBy: _createdAt_DESC
        first: $first
        locale: $locale
        fallbackLocales: $fallbackLocale
        skip: $skip
      ) {
        id
        ...PostExcerptFragment
      }
      _allPostsMeta(locale: $locale, filter: { title: { isBlank: "false" } }) {
        count
      }
    }
  `,
  [PostExcerptFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
