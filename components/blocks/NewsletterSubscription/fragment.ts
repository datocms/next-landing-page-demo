import { graphql } from '@/lib/datocms/graphql';

export const NewsletterSubscriptionFragment = graphql(/* GraphQL */ `
  fragment NewsletterSubscriptionFragment on NewsletterSubscriptionRecord {
    buttonLabel
    subtitle {
      value
    }
    title
  }
`);
