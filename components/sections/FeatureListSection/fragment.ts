import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const FeatureListSectionFragment = graphql(
  /* GraphQL */ `
    fragment FeatureListSectionFragment on FeatureListSectionRecord {
      featuresHeader
      featuresSubheader
      displayOption
      feature {
        __typename
        id
        featureTitle
        featureDescription
        featureIcon {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
