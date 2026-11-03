import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const AboutIntroFragment = graphql(
  /* GraphQL */ `
    fragment AboutIntroFragment on AboutIntroRecord {
      preHeader
      header
      subheader {
        value
      }
      introductionText {
        value
      }
      images {
        id
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
