import { graphql } from '@/lib/datocms/graphql';

export const FeaturedDocumentationPagesFragment = graphql(/* GraphQL */ `
  fragment FeaturedDocumentationPagesFragment on DocumentationHomeRecord {
    featuredPages {
      id
      slug
      title
      subtitle
      parent {
        id
        title
      }
    }
  }
`);
