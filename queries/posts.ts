export const postsQuery = `query MyQuery {
  allPosts(orderBy: _createdAt_DESC, first: "9") {
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
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          bgColor
          base64
        }
      }
    }
    author {
      name
      bio
      picture {
        responsiveImage(imgixParams: {w: "64", h: "64", fit: crop}) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          bgColor
          base64
        }
      }
    }
  }
}`;
