import { graphql } from '@/lib/datocms/graphql';

export const TimelineSectionFragment = graphql(/* GraphQL */ `
  fragment TimelineSectionFragment on TimelineSectionBlockRecord {
    # oldest first: the last one is where the company stands now
    milestones {
      id
      period
      title
      description {
        value
      }
    }
  }
`);
