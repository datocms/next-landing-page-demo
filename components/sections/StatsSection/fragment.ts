import { graphql } from '@/lib/datocms/graphql';

export const StatsSectionFragment = graphql(/* GraphQL */ `
  fragment StatsSectionFragment on StatsSectionBlockRecord {
    layout
    statistics {
      id
      label
      quantity
      icon {
        url
        width
        height
      }
    }
  }
`);
