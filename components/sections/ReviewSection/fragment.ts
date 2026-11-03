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
      reviewerName
      reviewerPicture {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      reviewerTitle
    }
  `,
  [ResponsiveImageFragment],
);

export const ReviewSectionFragment = graphql(
  /* GraphQL */ `
    fragment ReviewSectionFragment on ReviewSectionRecord {
      reviewSectionHeader
      reviewSectionSubheader {
        value
      }
      displayOptions
      reviews {
        id
        ...TestimonialFragment
      }
    }
  `,
  [TestimonialFragment],
);
