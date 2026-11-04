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
    query TagQuery(
      $slug: String
      $locale: SiteLocale
      $fallbackLocales: [SiteLocale!]
    ) {
      tag(filter: { slug: { eq: $slug } }, locale: $locale) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        tag
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
        _allReferencingPostsMeta(
          locale: $locale
          filter: { title: { isBlank: "false" } }
        ) {
          count
        }
      }
    }
  `,
  [TagFragment, PostExcerptFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
