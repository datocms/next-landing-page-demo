export const aboutQuery = `query MyQuery($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
  page(filter: {label: {eq: "About"}}, locale: $locale, fallbackLocales: $fallbackLocale) {
    sections {
      ... on TeamSectionRecord {
        _modelApiKey
        id
        displayOptions
        title
        subtitle
        showcasedMembers {
          name
          id
          bio
          description
          picture {
            responsiveImage(imgixParams: {w: "400", h: "256", fit: crop}) {
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
      ... on FaqSectionRecord {
        _modelApiKey
        title
        subtitle
        questions {
          question
          id
          answer {
            value
          }
        }
      }
    }
  }
}`;
