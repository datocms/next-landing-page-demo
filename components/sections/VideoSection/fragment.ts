import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const VideoSectionFragment = graphql(
  /* GraphQL */ `
    fragment VideoSectionFragment on VideoSectionBlockRecord {
      title
      subtitle {
        value
      }
      video {
        providerUid
        provider
        thumbnailUrl
      }
      # Cropped to the 16:9 frame around the focal point
      thumbnail {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "1920"
            h: "1080"
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
