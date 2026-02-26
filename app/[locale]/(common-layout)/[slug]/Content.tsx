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
import { stripStega } from '@datocms/content-link';

const normalizeDisplayOption = (value?: string) => stripStega(value || '');

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
              <Changelog
                key={section.id}
                fragment={section}
                globalPageProps={globalPageProps}
              />
            );
          }
          case 'HeroSectionRecord': {
            switch (normalizeDisplayOption(section.displayOptions)) {
              case 'gradient':
                return <GradientHero key={section.id} fragment={section} />;
              case 'right_image':
                return <RightImageHero key={section.id} fragment={section} />;
              case 'background_image':
                return (
                  <BackgroundImageHero key={section.id} fragment={section} />
                );
              case 'split_image':
                return <SplitImage key={section.id} fragment={section} />;
              default:
                return <Hero key={section.id} fragment={section} />;
            }
          }

          case 'FeatureListSectionRecord': {
            switch (normalizeDisplayOption(section.displayOption)) {
              case 'card_minimal':
                return (
                  <MinimalCardsFeature key={section.id} fragment={section} />
                );
              case 'grid':
                return <Features key={section.id} fragment={section} />;
              case 'big_image_horizontal':
                return (
                  <BigImageHorizontalFeatures
                    key={section.id}
                    fragment={section}
                  />
                );
              case 'big_image_vertical':
                return (
                  <BigImageVerticalFeatures
                    key={section.id}
                    fragment={section}
                  />
                );
              default:
                return <FeatureCards key={section.id} fragment={section} />;
            }
          }

          case 'VideoSectionRecord': {
            return <Video key={section.id} fragment={section} />;
          }
          case 'BrandSectionRecord': {
            switch (normalizeDisplayOption(section.displayOptions)) {
              case 'brand_cards':
                return <BrandCards key={section.id} fragment={section} />;
              default:
                return <Brands key={section.id} fragment={section} />;
            }
          }
          case 'DetailSectionRecord': {
            return <DetailSection key={section.id} fragment={section} />;
          }
          case 'ReviewSectionRecord': {
            switch (normalizeDisplayOption(section.displayOptions)) {
              case 'card_carrousel':
                return <Carousel key={section.id} fragment={section} />;
              case 'modern_carrousel':
                return <ModernCarousel key={section.id} fragment={section} />;
              case 'minimal_carrousel':
                return <MinimalCarousel key={section.id} fragment={section} />;
              case 'minimal_cards':
                return (
                  <MinimalReviewCards key={section.id} fragment={section} />
                );
              default:
                return <Testimonials key={section.id} fragment={section} />;
            }
          }

          case 'PricingSectionRecord': {
            switch (normalizeDisplayOption(section.displayOption)) {
              case 'cards_gradient':
                return <GradientCards key={section.id} fragment={section} />;
              case 'minimal':
                return <Minimal key={section.id} fragment={section} />;
              case 'feature_list':
                return (
                  <FeatureListSelector key={section.id} fragment={section} />
                );
              case 'mini_cards':
                return <SmallCards key={section.id} fragment={section} />;
              default:
                return <Pricing key={section.id} fragment={section} />;
            }
          }

          case 'FeaturedPostsSectionRecord': {
            switch (normalizeDisplayOption(section.displayOptions)) {
              case 'modern_cards':
                return (
                  <ModernPostCards
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'carrousel':
                return (
                  <CarouselFeaturedPosts
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'carousel':
                return (
                  <CarouselFeaturedPosts
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'minimalist_grid':
                return (
                  <MinimalistFeaturedPostsGrid
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              case 'full_image_card':
                return (
                  <FullImageFeaturedPosts
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
              default:
                return (
                  <Blog
                    key={section.id}
                    globalPageProps={globalPageProps}
                    fragment={section}
                  />
                );
            }
          }

          case 'TeamSectionRecord': {
            if (normalizeDisplayOption(section.displayOptions) === 'compact')
              return (
                <CompactTeam
                  key={section.id}
                  fragment={section}
                  globalPageProps={globalPageProps}
                />
              );
            return (
              <ExpandedTeam
                key={section.id}
                fragment={section}
                globalPageProps={globalPageProps}
              />
            );
          }
          case 'FaqSectionRecord': {
            if (normalizeDisplayOption(section.displayOptions) === 'accordion') {
              return <FAQAccordion key={section.id} fragment={section} />;
            }

            return <FAQGrid key={section.id} fragment={section} />;
          }
          case 'StatsSectionRecord': {
            return <StatsSection key={section.id} fragment={section} />;
          }
          case 'AboutIntroRecord': {
            return <AboutIntro key={section.id} fragment={section} />;
          }
          case 'AllPostsSectionRecord': {
            return (
              <PostGridRenderer
                key={section.id}
                data={data}
                globalPageProps={globalPageProps}
              />
            );
          }
          case 'RedirectSectionRecord': {
            const redirectSectionRecord = section;
            redirect(
              buildUrl(
                globalPageProps,
                `/${stripStega(redirectSectionRecord.slugToRedirectTo)}`,
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
