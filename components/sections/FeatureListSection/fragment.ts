import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const FeatureListSectionFragment = graphql(
  /* GraphQL */ `
    fragment FeatureListSectionFragment on FeatureListSectionRecord {
      featuresHeader
      featuresSubheader {
        value
      }
      displayOption
      feature {
        id
        featureTitle
        featureDescription {
          value
        }
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
