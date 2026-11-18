import { graphql } from '@/lib/datocms/graphql';

export const FaqSectionFragment = graphql(/* GraphQL */ `
  fragment FaqSectionFragment on FaqSectionBlockRecord {
    layout
    questions {
      question
      id
      answer {
        value
      }
    }
  }
`);
