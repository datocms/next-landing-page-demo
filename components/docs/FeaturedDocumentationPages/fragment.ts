import { graphql } from '@/lib/datocms/graphql';

export const PreviewCardFragment = graphql(/* GraphQL */ `
  fragment PreviewCardFragment on DocumentationPageRecord {
    title
    subtitle
    slug
  }
`);

export const FeaturedDocumentationPagesFragment = graphql(
  /* GraphQL */ `
    fragment FeaturedDocumentationPagesFragment on DocumentationHomeRecord {
      featuredPages {
        id
        ...PreviewCardFragment
      }
    }
  `,
  [PreviewCardFragment],
);
