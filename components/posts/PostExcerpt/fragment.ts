import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

export const PostExcerptFragment = graphql(
  /* GraphQL */ `
    fragment PostExcerptFragment on PostRecord {
      _publishedAt
      slug
      id
      title
      tags {
        tag
      }
      seoTags {
        description
        image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      author {
        name
        bio
        slug
        picture {
          responsiveImage(imgixParams: { w: "64", h: "64", fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
