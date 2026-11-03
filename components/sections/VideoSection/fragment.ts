import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const VideoSectionFragment = graphql(
  /* GraphQL */ `
    fragment VideoSectionFragment on VideoSectionRecord {
      videoHeader
      videoSubheader {
        value
      }
      video {
        providerUid
        provider
        thumbnailUrl
      }
      videoThumbnail {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
