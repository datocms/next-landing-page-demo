import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import { graphql } from '@/lib/datocms/graphql';

/** What every post list needs: the cards, the featured post and the text rows */
export const PostExcerptFragment = graphql(
  /* GraphQL */ `
    fragment PostExcerptFragment on PostRecord {
      id
      _publishedAt
      slug
      title
      tags {
        name
        # The topic links of the blog index
        slug
      }
      # The body's first paragraph is the card's excerpt when the description repeats the title
      content {
        value
      }
      seoMeta {
        description
      }
      coverImage {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: {
            w: "1600"
            h: "1000"
            fit: crop
            crop: focalpoint
            auto: format
          }
        ) {
          ...ResponsiveImageFragment
        }
      }
      author {
        name
        picture {
          responsiveImage(
            imgixParams: {
              w: "48"
              h: "48"
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
