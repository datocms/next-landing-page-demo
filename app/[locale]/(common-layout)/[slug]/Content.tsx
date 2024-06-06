import AboutIntro from '@/components/About/AboutIntro';
import CompactTeam from '@/components/About/CompactTeam';
import ExpandedTeam from '@/components/About/ExpandedTeam';
import FAQAccordion from '@/components/About/FAQAccordion';
import FAQGrid from '@/components/About/FAQGrid';
import StatsSection from '@/components/About/StatsSection';
import Blog from '@/components/Blog';
import PostGridRenderer from '@/components/Blog/PostGridRenderer';
import Changelog from '@/components/Changelog';
import Brands from '@/components/Home/Brands';
import BrandCards from '@/components/Home/Brands/BrandCards';
import DetailSection from '@/components/Home/Detail/DetailSection';
import CarouselFeaturedPosts from '@/components/Home/FeaturedPosts/CarouselFeaturedPosts';
import FullImageFeaturedPosts from '@/components/Home/FeaturedPosts/FullImageFeaturedPosts';
import MinimalistFeaturedPostsGrid from '@/components/Home/FeaturedPosts/MinimalistFeaturedPostsGrid';
import ModernPostCards from '@/components/Home/FeaturedPosts/ModernPostCards';
import Features from '@/components/Home/Features';
import BigImageHorizontalFeatures from '@/components/Home/Features/BigImageHorizontalFeatures';
import BigImageVerticalFeatures from '@/components/Home/Features/BigImageVerticalFeatures';
import FeatureCards from '@/components/Home/Features/FeatureCards';
import MinimalCardsFeature from '@/components/Home/Features/MinimalCardsFeature';
import Hero from '@/components/Home/Hero';
import BackgroundImageHero from '@/components/Home/Hero/BackgroundImage';
import GradientHero from '@/components/Home/Hero/GradientHero';
import RightImageHero from '@/components/Home/Hero/RightImageHero';
import SplitImage from '@/components/Home/Hero/SplitImage';
import Pricing from '@/components/Home/Pricing';
import FeatureListSelector from '@/components/Home/Pricing/FeatureListSelector';
import GradientCards from '@/components/Home/Pricing/GradientCards';
import Minimal from '@/components/Home/Pricing/Minimal';
import SmallCards from '@/components/Home/Pricing/SmallCards';
import Testimonials from '@/components/Home/Testimonials';
import Carousel from '@/components/Home/Testimonials/Carousel';
import MinimalCarousel from '@/components/Home/Testimonials/MinimalCarousel';
import MinimalReviewCards from '@/components/Home/Testimonials/MinimalReviewCards';
import ModernCarousel from '@/components/Home/Testimonials/ModernCarousel';
import Video from '@/components/Home/Video';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { buildUrl } from '@/utils/globalPageProps';
import { notFound, redirect } from 'next/navigation';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.page) {
    notFound();
  }

  return (
    <>
      {data.page.sections.map((section) => {
        switch (section.__typename) {
          case 'ChangelogSectionRecord': {
            return (
              <Changelog section={section} globalPageProps={globalPageProps} />
            );
          }
          case 'HeroSectionRecord': {
            switch (section.displayOptions) {
              case 'gradient':
                return <GradientHero section={section} />;
              case 'right_image':
                return <RightImageHero section={section} />;
              case 'background_image':
                return <BackgroundImageHero section={section} />;
              case 'split_image':
                return <SplitImage section={section} />;
              default:
                return <Hero section={section} />;
            }
          }

          case 'FeatureListSectionRecord': {
            switch (section.displayOption) {
              case 'card_minimal':
                return <MinimalCardsFeature section={section} />;
              case 'grid':
                return <Features section={section} />;
              case 'big_image_horizontal':
                return <BigImageHorizontalFeatures section={section} />;
              case 'big_image_vertical':
                return <BigImageVerticalFeatures section={section} />;
              default:
                return <FeatureCards section={section} />;
            }
          }

          case 'VideoSectionRecord': {
            return <Video section={section} />;
          }
          case 'BrandSectionRecord': {
            switch (section.displayOptions) {
              case 'brand_cards':
                return <BrandCards section={section} />;
              default:
                return <Brands section={section} />;
            }
          }
          case 'DetailSectionRecord': {
            return <DetailSection section={section} />;
          }
          case 'ReviewSectionRecord': {
            switch (section.displayOptions) {
              case 'card_carrousel':
                return <Carousel section={section} />;
              case 'modern_carrousel':
                return <ModernCarousel section={section} />;
              case 'minimal_carrousel':
                return <MinimalCarousel section={section} />;
              case 'minimal_cards':
                return <MinimalReviewCards section={section} />;
              default:
                return <Testimonials section={section} />;
            }
          }

          case 'PricingSectionRecord': {
            switch (section.displayOption) {
              case 'cards_gradient':
                return <GradientCards section={section} />;
              case 'minimal':
                return <Minimal section={section} />;
              case 'feature_list':
                return <FeatureListSelector section={section} />;
              case 'mini_cards':
                return <SmallCards section={section} />;
              default:
                return <Pricing section={section} />;
            }
          }

          case 'FeaturedPostsSectionRecord': {
            switch (section.displayOptions) {
              case 'modern_cards':
                return (
                  <ModernPostCards
                    globalPageProps={globalPageProps}
                    section={section}
                  />
                );
              case 'carrousel':
                return (
                  <CarouselFeaturedPosts
                    globalPageProps={globalPageProps}
                    section={section}
                  />
                );
              case 'minimalist_grid':
                return (
                  <MinimalistFeaturedPostsGrid
                    globalPageProps={globalPageProps}
                    section={section}
                  />
                );
              case 'full_image_card':
                return (
                  <FullImageFeaturedPosts
                    globalPageProps={globalPageProps}
                    section={section}
                  />
                );
              default:
                return (
                  <Blog globalPageProps={globalPageProps} section={section} />
                );
            }
          }

          case 'TeamSectionRecord': {
            if (section.displayOptions === 'compact')
              return (
                <CompactTeam
                  section={section}
                  globalPageProps={globalPageProps}
                />
              );
            return (
              <ExpandedTeam
                section={section}
                globalPageProps={globalPageProps}
              />
            );
          }
          case 'FaqSectionRecord': {
            if (section.displayOptions === 'accordion') {
              return <FAQAccordion section={section} />;
            }

            return <FAQGrid section={section} />;
          }
          case 'StatsSectionRecord': {
            return <StatsSection section={section} />;
          }
          case 'AboutIntroRecord': {
            return <AboutIntro section={section} />;
          }
          case 'AllPostsSectionRecord': {
            return (
              <PostGridRenderer data={data} globalPageProps={globalPageProps} />
            );
          }
          case 'RedirectSectionRecord': {
            const redirectSectionRecord = section;
            redirect(
              buildUrl(
                globalPageProps,
                `/${redirectSectionRecord.slugToRedirectTo}`,
              ),
            );
            return null;
          }
          default:
            return null;
        }
      })}
    </>
  );
};

export default Content;
