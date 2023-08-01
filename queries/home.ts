export const homeQuery = `query MyQuery($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
  home(locale: $locale, fallbackLocales: $fallbackLocale) {
    sections {
      ... on HeroSectionRecord {
        buttons {
          id
          label
          primary
          url
        }
        _modelApiKey
        id
        heroSubtitle
        heroTitle
      }
      ... on VideoSectionRecord {
        _modelApiKey
        id
        videoHeader
        videoSubheader
        video {
          providerUid
          provider
          thumbnailUrl
        }
      }
      ... on DetailSectionRecord {
        _modelApiKey
        id
        details {
          value
        }
        imagePosition
        image {
          url
        }
      }
      ... on ReviewSectionRecord {
        _modelApiKey
        id
        reviewSectionHeader
        reviewSectionSubheader
        review {
          id
          _modelApiKey
          rating
          review
          reviewerName
          reviewerTitle
          reviewerPicture {
            url
          }
        }
      }
      ... on PricingSectionRecord {
        pricingSectionSubheader
        _modelApiKey
        id
        plans {
          id
          _modelApiKey
          monthlyPrice
          tierDescription
          tierName
          yearlyPrice
          planCharacteristic {
            lifetimeAccess
            useWithUnlimitedProjects
            freeLifetimeUpdates
            emailSupport
            commercialUse
            allUiComponents
            _modelApiKey
          }
        }
        pricingSectionHeader
      }
      ... on BrandSectionRecord {
        _modelApiKey
        id
        brand {
          _modelApiKey
          brandName
          brandUrl
          id
          brandLogo {
            url
          }
        }
      }
      ... on FeaturedPostsSectionRecord {
        _modelApiKey
        id
        featuredPostsHeader
        featuredPostsSubheader
        featuredPosts {
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
      }
      ... on FeatureListSectionRecord {
        _modelApiKey
        id
        featuresHeader
        featuresSubheader
        feature {
          _modelApiKey
          id
          featureTitle
          featureDescription
          featureIcon {
            url
          }
        }
      }
    }
  }
}`;
