import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const DetailSectionFragment = graphql(
  /* GraphQL */ `
    fragment DetailSectionFragment on DetailSectionRecord {
      details {
        value
      }
      imagePosition
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
