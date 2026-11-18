import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const CtaButtonWithImageFragment = graphql(
  /* GraphQL */ `
    fragment CtaButtonWithImageFragment on CtaButtonWithImageBlockRecord {
      title
      buttonLabel
      buttonUrl
      subtitle {
        value
      }
      image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "640"
            h: "480"
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
