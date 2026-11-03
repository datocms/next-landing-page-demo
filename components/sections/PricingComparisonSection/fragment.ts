import { graphql } from '@/lib/datocms/graphql';

export const PricingComparisonSectionFragment = graphql(/* GraphQL */ `
  fragment PricingComparisonSectionFragment on PricingComparisonSectionRecord {
    comparisonHeader
    comparisonSubheader {
      value
    }
    plans {
      id
      tierName
      monthlyPrice
      highlightLabel
      ctaLabel
      planLimits {
        id
        group
        label
        value
      }
    }
  }
`);
