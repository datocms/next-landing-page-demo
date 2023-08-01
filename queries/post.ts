export const postQuery = `query MyQuery($slug: String, $locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
  post(filter: {slug: {eq: $slug}}, locale: $locale, fallbackLocales: $fallbackLocale) {
    _publishedAt
    title
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
    tags {
      id
      tag
    }
    content {
      value
      blocks {
        id
        __typename
        image {
          id
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
            base64
          }
        }
      }
    }
  }
}`;
