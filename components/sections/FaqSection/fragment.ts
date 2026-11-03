import { graphql } from '@/lib/datocms/graphql';

export const FaqSectionFragment = graphql(/* GraphQL */ `
  fragment FaqSectionFragment on FaqSectionRecord {
    displayOptions
    title
    subtitle
    questions {
      question
      id
      answer {
        value
      }
    }
  }
`);
