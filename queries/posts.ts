export const postsQuery = `query MyQuery($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
  allPosts(orderBy: _createdAt_DESC, first: "9", locale: $locale, fallbackLocales: $fallbackLocale) {
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
