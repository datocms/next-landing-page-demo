import { PostExcerptFragment } from '@/components/posts/PostExcerpt/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const FeaturedPostsSectionFragment = graphql(
  /* GraphQL */ `
    fragment FeaturedPostsSectionFragment on FeaturedPostsSectionRecord {
      featuredPostsHeader
      featuredPostsSubheader
      displayOptions
      featuredPosts {
        id
        ...PostExcerptFragment
      }
    }
  `,
  [PostExcerptFragment],
);
