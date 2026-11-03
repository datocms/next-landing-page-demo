import { graphql } from '@/lib/datocms/graphql';

export const PricingSectionFragment = graphql(/* GraphQL */ `
  fragment PricingSectionFragment on PricingSectionRecord {
    pricingSectionHeader
    pricingSectionSubheader {
      value
    }
    displayOption
    plans {
      id
      yearlyPrice
      monthlyPrice
      tierName
      tierDescription {
        value
      }
      slug
      planFeatures
      highlightLabel
      ctaLabel
      priceNote
    }
  }
`);
