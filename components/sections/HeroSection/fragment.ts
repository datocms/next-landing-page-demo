import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const HeroSectionFragment = graphql(
  /* GraphQL */ `
    fragment HeroSectionFragment on HeroSectionRecord {
      buttons {
        id
        label
        primary
        url
      }
      heroSubtitle
      heroTitle
      displayOptions
      heroImage {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
