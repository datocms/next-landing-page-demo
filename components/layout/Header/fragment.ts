import { graphql } from '@/lib/datocms/graphql';

export const HeaderFragment = graphql(/* GraphQL */ `
  fragment HeaderFragment on LayoutRecord {
    logo {
      url
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
          id
          title
          page {
            slug
          }
        }
      }
    }
    notification {
      value
    }
  }
`);
