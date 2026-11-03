import { graphql } from '@/lib/datocms/graphql';

export const StatsSectionFragment = graphql(/* GraphQL */ `
  fragment StatsSectionFragment on StatsSectionRecord {
    title
    subtitle {
      value
    }
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
