import { graphql } from '@/lib/datocms/graphql';

export const BrandSectionFragment = graphql(/* GraphQL */ `
  fragment BrandSectionFragment on BrandSectionBlockRecord {
    layout
    brands {
      name
      url
      id
      logo {
        url
        alt
        width
        height
        format
      }
    }
  }
`);
