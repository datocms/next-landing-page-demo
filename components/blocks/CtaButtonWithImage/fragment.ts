import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const CtaButtonWithImageFragment = graphql(
  /* GraphQL */ `
    fragment CtaButtonWithImageFragment on CtaButtonWithImageRecord {
      title
      subtitle
      image {
        id
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      buttonLabel
    }
  `,
  [ResponsiveImageFragment],
);
