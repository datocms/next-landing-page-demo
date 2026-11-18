import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const ImageBlockFragment = graphql(
  /* GraphQL */ `
    fragment ImageBlockFragment on ImageBlockRecord {
      image {
        id
        # 2x the widest it is drawn (924px, wider than the text column)
        # A 3:2 frame around the focal point, so a tall photo doesn't fill the screen
        responsiveImage(
          imgixParams: {
            w: "1900"
            ar: "3:2"
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
