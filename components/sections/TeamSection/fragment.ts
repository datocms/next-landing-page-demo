import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const TeamSectionFragment = graphql(
  /* GraphQL */ `
    fragment TeamSectionFragment on TeamSectionBlockRecord {
      layout
      showcasedMembers {
        name
        id
        slug
        role
        description {
          value
        }
        avatar: picture {
          responsiveImage(
            imgixParams: {
              w: "112"
              h: "112"
              fit: crop
              crop: focalpoint
              # The avatars are drawn as busts: small crops zoom in on the head
              fpZ: 1.5
              auto: format
            }
          ) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
