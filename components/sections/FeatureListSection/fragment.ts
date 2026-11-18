import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import {
  IconCardFragment,
  ListCardFragment,
  MessageCardFragment,
  MetricsCardFragment,
} from '@/components/product/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const FeatureListSectionFragment = graphql(
  /* GraphQL */ `
    fragment FeatureListSectionFragment on FeatureListSectionBlockRecord {
      layout
      features {
        id
        title
        description {
          value
        }
        # grid only: a product card that replaces the icon
        illustration {
          __typename
          ... on MetricsCardBlockRecord {
            ...MetricsCardFragment
          }
          ... on ListCardBlockRecord {
            ...ListCardFragment
          }
          ... on MessageCardBlockRecord {
            ...MessageCardFragment
          }
          ... on IconCardBlockRecord {
            ...IconCardFragment
          }
        }
        # SVG icons have no responsiveImage: they are drawn from their url
        icon {
          url
          alt
          format
          width
          height
          responsiveImage(
            imgixParams: { w: "40", h: "40", fit: crop, auto: format }
          ) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [
    ResponsiveImageFragment,
    MetricsCardFragment,
    ListCardFragment,
    MessageCardFragment,
    IconCardFragment,
  ],
);
