import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const TestimonialFragment = graphql(
  /* GraphQL */ `
    fragment TestimonialFragment on TestimonialRecord {
      id
      rating
      review {
        value
      }
      name
      # Square, in colour: the largest avatar is 56px
      picture {
        responsiveImage(
          imgixParams: {
            w: "112"
            h: "112"
            fit: crop
            crop: focalpoint
            auto: format
          }
        ) {
          ...ResponsiveImageFragment
        }
      }
      role
      # A 4:5 crop for the layouts that show the person as a photograph
      portrait: picture {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "480"
            h: "600"
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

export const ReviewSectionFragment = graphql(
  /* GraphQL */ `
    fragment ReviewSectionFragment on TestimonialSectionBlockRecord {
      layout
      testimonials {
        id
        ...TestimonialFragment
      }
    }
  `,
  [TestimonialFragment],
);
