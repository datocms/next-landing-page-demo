import { graphql } from '@/lib/datocms/graphql';

export const HeaderFragment = graphql(/* GraphQL */ `
  fragment HeaderFragment on LayoutRecord {
    logo {
      url
      width
      height
    }
    menu {
      ... on MenuItemBlockRecord {
        id
        title
        __typename
        link {
          __typename
          ... on PageRecord {
            slug
          }
        }
      }
      ... on MenuDropdownBlockRecord {
        id
        title
        __typename
        items {
          id
          title
          link {
            __typename
            ... on PageRecord {
              slug
            }
          }
        }
      }
    }
  }
`);
