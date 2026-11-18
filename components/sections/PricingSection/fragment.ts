import { graphql, type ResultOf } from '@/lib/datocms/graphql';

export const PricingSectionFragment = graphql(/* GraphQL */ `
  fragment PricingSectionFragment on PricingSectionBlockRecord {
    layout
    plans {
      id
      yearlyPrice
      monthlyPrice
      name
      description {
        value
      }
      features {
        id
        label
      }
      highlightLabel
      ctaLabel
      priceNote
    }
  }
`);

/** One plan of a pricing block, as every layout reads it */
export type Plan = ResultOf<typeof PricingSectionFragment>['plans'][number];
