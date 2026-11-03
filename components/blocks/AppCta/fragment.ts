import { graphql } from '@/lib/datocms/graphql';

export const AppCtaFragment = graphql(/* GraphQL */ `
  fragment AppCtaFragment on AppCtaRecord {
    text
    title
    googlePlayUrl
    appstoreUrl
  }
`);
