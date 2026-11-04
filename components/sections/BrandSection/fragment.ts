import { graphql } from '@/lib/datocms/graphql';

export const BrandSectionFragment = graphql(/* GraphQL */ `
  fragment BrandSectionFragment on BrandSectionRecord {
    displayOptions
    brand {
      brandName
      brandUrl
      id
      brandLogo {
        url
      }
    }
  }
`);
