import { graphql } from '@/lib/datocms/graphql';

export const CtaSectionFragment = graphql(/* GraphQL */ `
  fragment CtaSectionFragment on CtaSectionBlockRecord {
    layout
    title
    subtitle {
      value
    }
    buttons {
      id
      label
      primary
      url
    }
  }
`);
