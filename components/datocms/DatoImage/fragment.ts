import { graphql } from '@/lib/datocms/graphql';

export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    src
    srcSet
    base64
    width
    height
    alt
    title
  }
`);
