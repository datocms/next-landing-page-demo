import { graphql } from '@/lib/datocms/graphql';

export const AppCtaFragment = graphql(/* GraphQL */ `
  fragment AppCtaFragment on AppCtaBlockRecord {
    title
    subtitle {
      value
    }
    googlePlayUrl
    appstoreUrl
  }
`);
