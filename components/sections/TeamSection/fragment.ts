import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const TeamSectionFragment = graphql(
  /* GraphQL */ `
    fragment TeamSectionFragment on TeamSectionRecord {
      displayOptions
      title
      subtitle
      showcasedMembers {
        name
        id
        slug
        bio
        description
        picture {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
