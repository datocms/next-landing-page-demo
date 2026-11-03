import { graphql } from '@/lib/datocms/graphql';

export const StatsSectionFragment = graphql(/* GraphQL */ `
  fragment StatsSectionFragment on StatsSectionRecord {
    title
    subtitle
    statistic {
      id
      label
      quantity
      icon {
        url
      }
    }
  }
`);
