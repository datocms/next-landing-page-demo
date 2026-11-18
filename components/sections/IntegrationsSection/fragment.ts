import { graphql } from '@/lib/datocms/graphql';

export const IntegrationsSectionFragment = graphql(/* GraphQL */ `
  fragment IntegrationsSectionFragment on IntegrationSectionBlockRecord {
    layout
    integrations {
      id
      name
      # one-colour SVGs, drawn as a mask so they take the text colour
      icon {
        url
        width
        height
      }
    }
  }
`);
