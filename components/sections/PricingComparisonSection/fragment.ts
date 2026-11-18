import { graphql } from '@/lib/datocms/graphql';

export const PricingComparisonSectionFragment = graphql(/* GraphQL */ `
  fragment PricingComparisonSectionFragment on PricingComparisonSectionBlockRecord {
    plans {
      id
      name
      monthlyPrice
      highlightLabel
      limits {
        id
        group
        label
        value
      }
    }
  }
`);
