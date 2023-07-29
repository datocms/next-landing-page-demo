import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import Blog from '@/components/Blog';
import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
import Contact from '@/components/Contact';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Video from '@/components/Video';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

function getSection(blockKey: string, sections) {
  return sections.find((block) => block._modelApiKey === blockKey);
}

export default async function Home() {
  const { home } = await queryDatoCMS(`{
    home {
      sections {
        ... on FeatureListSectionRecord {
          _modelApiKey
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
        ... on HeroSectionRecord {
          _modelApiKey
          heroSubtitle
          heroTitle
        }
        ... on VideoSectionRecord {
          _modelApiKey
          videoHeader
          videoSubheader
          video {
            providerUid
            provider
            thumbnailUrl
          }
        }
        ... on DetailSectionRightRecord {
          _modelApiKey
          id
          detailsToBeDisplayed
          detailsSectionHeader
          detailSelectionSubheader
          rightImage {
            url
          }
        }
        ... on DetailSectionLeftRecord {
          _modelApiKey
          detail {
            _modelApiKey
            detailHeader
            detailDescription
            id
          }
          leftImage {
            url
          }
        }
        ... on ReviewSectionRecord {
          _modelApiKey
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
          _modelApiKey
        }
        ... on FeaturedPostsSectionRecord {
          _modelApiKey
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
      }
    }
  }`);

  const hero = getSection('hero_section', home.sections);
  const featureList = getSection('feature_list_section', home.sections);
  const videoSection = getSection('video_section', home.sections);
  const brandsSection = getSection('brand_section', home.sections);
  const detailSectionRight = getSection('detail_section_right', home.sections);
  const detailSectionLeft = getSection('detail_section_left', home.sections);
  const testimonialSection = getSection('review_section', home.sections);
  const pricingSection = getSection('pricing_section', home.sections);
  const featuredPostsSection = getSection(
    'featured_posts_section',
    home.sections
  );

  return (
    <>
      <ScrollUp />
      <Hero heroTitle={hero.heroTitle} heroSubtitle={hero.heroSubtitle} />
      <Features
        features={featureList.feature}
        featuresHeader={featureList.featuresHeader}
        featuresSubheader={featureList.featuresSubheader}
      />
      <Video
        videoHeader={videoSection.videoHeader}
        videoSubheader={videoSection.videoSubheader}
        videoUid={videoSection.video.providerUid}
        videoThumbnail={videoSection.video.thumbnailUrl}
        videoProvider={videoSection.video.provider}
      />
      <Brands brandShowcase={brandsSection.brand} />
      <AboutSectionOne
        header={detailSectionRight.detailsSectionHeader}
        subheader={detailSectionRight.detailSelectionSubheader}
        imageURL={detailSectionRight.rightImage.url}
        featureList={detailSectionRight.detailsToBeDisplayed}
      />
      <AboutSectionTwo
        imageURL={detailSectionLeft.leftImage.url}
        details={detailSectionLeft.detail}
      />
      <Testimonials
        header={testimonialSection.reviewSectionHeader}
        subheader={testimonialSection.reviewSectionSubheader}
        reviews={testimonialSection.review}
      />
      <Pricing
        header={pricingSection.pricingSectionHeader}
        subheader={pricingSection.pricingSectionSubheader}
        plans={pricingSection.plans}
      />
      <Blog
        blogData={featuredPostsSection.featuredPosts}
        blogHeader={featuredPostsSection.featuredPostsHeader}
        blogSubheader={featuredPostsSection.featuredPostsSubheader}
      />
    </>
  );
}
