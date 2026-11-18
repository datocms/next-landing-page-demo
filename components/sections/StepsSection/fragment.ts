import {
  IconCardFragment,
  ListCardFragment,
  MessageCardFragment,
  MetricsCardFragment,
} from '@/components/product/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const StepsSectionFragment = graphql(
  /* GraphQL */ `
    fragment StepsSectionFragment on StepsSectionBlockRecord {
      layout
      steps {
        id
        title
        description {
          value
        }
        # optional: a product card drawn at the top of the step's tile
        illustration {
          __typename
          ... on MetricsCardBlockRecord {
            ...MetricsCardFragment
          }
          ... on ListCardBlockRecord {
            ...ListCardFragment
          }
          ... on MessageCardBlockRecord {
            ...MessageCardFragment
          }
          ... on IconCardBlockRecord {
            ...IconCardFragment
          }
        }
      }
    }
  `,
  [
    MetricsCardFragment,
    ListCardFragment,
    MessageCardFragment,
    IconCardFragment,
  ],
);
