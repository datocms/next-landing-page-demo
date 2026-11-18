import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const DetailSectionFragment = graphql(
  /* GraphQL */ `
    fragment DetailSectionFragment on DetailSectionBlockRecord {
      layout
      details {
        value
      }
      imagePosition
      # panel: the image filling a tall half of the panel
      tall: image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "960", h: "1100", fit: crop, crop: focalpoint, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # overlap: the image wide, under the text card
      wide: image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "1600", h: "960", fit: crop, crop: focalpoint, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # In colour, cropped to the 4:3 frame around the focal point
      image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "1420"
            h: "1065"
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
