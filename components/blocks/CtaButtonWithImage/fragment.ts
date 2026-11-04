import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const CtaButtonWithImageFragment = graphql(
  /* GraphQL */ `
    fragment CtaButtonWithImageFragment on CtaButtonWithImageRecord {
      title
      subtitle {
        value
      }
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      buttonLabel
    }
  `,
  [ResponsiveImageFragment],
);
