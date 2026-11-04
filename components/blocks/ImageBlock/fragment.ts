import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const ImageBlockFragment = graphql(
  /* GraphQL */ `
    fragment ImageBlockFragment on ImageBlockRecord {
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
