import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import AboutIntro from '@/components/blocksWithVariants/AboutIntroRecord/AboutIntro';
import PostGridRenderer from '@/components/blocksWithVariants/AllPostsSectionRecord/PostGridRenderer';
import BrandCards from '@/components/blocksWithVariants/BrandSectionRecord/BrandCards';
import Brands from '@/components/blocksWithVariants/BrandSectionRecord/Brands';
import Changelog from '@/components/blocksWithVariants/ChangelogSectionRecord/Changelog';
import DetailSection from '@/components/blocksWithVariants/DetailSectionRecord/DetailSection';
import FAQAccordion from '@/components/blocksWithVariants/FaqSectionRecord/FAQAccordion';
import FAQGrid from '@/components/blocksWithVariants/FaqSectionRecord/FAQGrid';
import BigImageHorizontalFeatures from '@/components/blocksWithVariants/FeatureListSectionRecord/BigImageHorizontalFeatures';
import BigImageVerticalFeatures from '@/components/blocksWithVariants/FeatureListSectionRecord/BigImageVerticalFeatures';
import FeatureCards from '@/components/blocksWithVariants/FeatureListSectionRecord/FeatureCards';
import Features from '@/components/blocksWithVariants/FeatureListSectionRecord/Features';
import MinimalCardsFeature from '@/components/blocksWithVariants/FeatureListSectionRecord/MinimalCardsFeature';
import Blog from '@/components/blocksWithVariants/FeaturedPostsSectionRecord/Blog';
import CarouselFeaturedPosts from '@/components/blocksWithVariants/FeaturedPostsSectionRecord/CarouselFeaturedPosts';
import FullImageFeaturedPosts from '@/components/blocksWithVariants/FeaturedPostsSectionRecord/FullImageFeaturedPosts';
import MinimalistFeaturedPostsGrid from '@/components/blocksWithVariants/FeaturedPostsSectionRecord/MinimalistFeaturedPostsGrid';
import ModernPostCards from '@/components/blocksWithVariants/FeaturedPostsSectionRecord/ModernPostCards';
import BackgroundImageHero from '@/components/blocksWithVariants/HeroSectionRecord/BackgroundImage';
import GradientHero from '@/components/blocksWithVariants/HeroSectionRecord/GradientHero';
import Hero from '@/components/blocksWithVariants/HeroSectionRecord/Hero';
import RightImageHero from '@/components/blocksWithVariants/HeroSectionRecord/RightImageHero';
import SplitImage from '@/components/blocksWithVariants/HeroSectionRecord/SplitImage';
import FeatureListSelector from '@/components/blocksWithVariants/PricingSectionRecord/FeatureListSelector';
import GradientCards from '@/components/blocksWithVariants/PricingSectionRecord/GradientCards';
import Minimal from '@/components/blocksWithVariants/PricingSectionRecord/Minimal';
import Pricing from '@/components/blocksWithVariants/PricingSectionRecord/Pricing';
import SmallCards from '@/components/blocksWithVariants/PricingSectionRecord/SmallCards';
import Carousel from '@/components/blocksWithVariants/ReviewSectionRecord/Carousel';
import MinimalCarousel from '@/components/blocksWithVariants/ReviewSectionRecord/MinimalCarousel';
import MinimalReviewCards from '@/components/blocksWithVariants/ReviewSectionRecord/MinimalReviewCards';
import ModernCarousel from '@/components/blocksWithVariants/ReviewSectionRecord/ModernCarousel';
import Testimonials from '@/components/blocksWithVariants/ReviewSectionRecord/Testimonials';
import StatsSection from '@/components/blocksWithVariants/StatsSectionRecord/StatsSection';
import CompactTeam from '@/components/blocksWithVariants/TeamSectionRecord/CompactTeam';
import ExpandedTeam from '@/components/blocksWithVariants/TeamSectionRecord/ExpandedTeam';
import Video from '@/components/blocksWithVariants/VideoSectionRecord/Video';
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
              <Changelog fragment={section} globalPageProps={globalPageProps} />
            );
          }
          case 'HeroSectionRecord': {
            switch (section.displayOptions) {
              case 'gradient':
                return <GradientHero fragment={section} />;
              case 'right_image':
                return <RightImageHero fragment={section} />;
              case 'background_image':
                return <BackgroundImageHero fragment={section} />;
              case 'split_image':
                return <SplitImage fragment={section} />;
              default:
                return <Hero fragment={section} />;
            }
          }

          case 'FeatureListSectionRecord': {
            switch (section.displayOption) {
              case 'card_minimal':
                return <MinimalCardsFeature fragment={section} />;
              case 'grid':
                return <Features fragment={section} />;
              case 'big_image_horizontal':
                return <BigImageHorizontalFeatures fragment={section} />;
              case 'big_image_vertical':
                return <BigImageVerticalFeatures fragment={section} />;
              default:
                return <FeatureCards fragment={section} />;
            }
          }

          case 'VideoSectionRecord': {
            return <Video fragment={section} />;
          }
          case 'BrandSectionRecord': {
            switch (section.displayOptions) {
              case 'brand_cards':
                return <BrandCards fragment={section} />;
              default:
                return <Brands fragment={section} />;
            }
          }
          case 'DetailSectionRecord': {
            return <DetailSection fragment={section} />;
          }
          case 'ReviewSectionRecord': {
            switch (section.displayOptions) {
              case 'card_carrousel':
                return <Carousel fragment={section} />;
              case 'modern_carrousel':
                return <ModernCarousel fragment={section} />;
              case 'minimal_carrousel':
                return <MinimalCarousel fragment={section} />;
              case 'minimal_cards':
                return <MinimalReviewCards fragment={section} />;
              default:
                return <Testimonials fragment={section} />;
            }
          }

          case 'PricingSectionRecord': {
            switch (section.displayOption) {
              case 'cards_gradient':
                return <GradientCards fragment={section} />;
              case 'minimal':
                return <Minimal fragment={section} />;
              case 'feature_list':
                return <FeatureListSelector fragment={section} />;
              case 'mini_cards':
                return <SmallCards fragment={section} />;
              default:
                return <Pricing fragment={section} />;
            }
          }

          case 'FeaturedPostsSectionRecord': {
            switch (section.displayOptions) {
              case 'modern_cards':
                return (
                  <ModernPostCards
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'carrousel':
                return (
                  <CarouselFeaturedPosts
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'minimalist_grid':
                return (
                  <MinimalistFeaturedPostsGrid
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'full_image_card':
                return (
                  <FullImageFeaturedPosts
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              default:
                return (
                  <Blog globalPageProps={globalPageProps} fragment={section} />
                );
            }
          }

          case 'TeamSectionRecord': {
            if (section.displayOptions === 'compact')
              return (
                <CompactTeam
                  fragment={section}
                  globalPageProps={globalPageProps}
                />
              );
            return (
              <ExpandedTeam
                fragment={section}
                globalPageProps={globalPageProps}
              />
            );
          }
          case 'FaqSectionRecord': {
            if (section.displayOptions === 'accordion') {
              return <FAQAccordion fragment={section} />;
            }

            return <FAQGrid fragment={section} />;
          }
          case 'StatsSectionRecord': {
            return <StatsSection fragment={section} />;
          }
          case 'AboutIntroRecord': {
            return <AboutIntro fragment={section} />;
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
