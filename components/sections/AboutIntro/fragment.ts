import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const AboutIntroFragment = graphql(
  /* GraphQL */ `
    fragment AboutIntroFragment on AboutIntroBlockRecord {
      eyebrow
      title
      subtitle {
        value
      }
      introductionText {
        value
      }
      images {
        id
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "1200"
            h: "900"
            fit: crop
            crop: focalpoint
            auto: format
          }
        ) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
