import { graphql } from '@/lib/datocms/graphql';

export const NewsletterSubscriptionFragment = graphql(/* GraphQL */ `
  fragment NewsletterSubscriptionFragment on NewsletterSubscriptionBlockRecord {
    buttonLabel
    subtitle {
      value
    }
    title
  }
`);
