import Blog from '../Blog';
import Brands from '../Home/Brands';
import Features from '../Home/Features';
import Hero from '../Home/Hero';
import Pricing from '../Home/Pricing';
import Testimonials from '../Home/Testimonials';
import Video from '../Home/Video';
import DetailSection from '../Home/Detail/DetailSection';
import CompactTeam from '../About/CompactTeam';
import ExpandedTeam from '../About/ExpandedTeam';
import FAQAccordion from '../About/FAQAccordion';
import FAQGrid from '../About/FAQGrid';
import StatsSection from '../About/StatsSection';
import AboutIntro from '../About/AboutIntro';
import {
  AboutIntroRecord,
  AllPostsSectionRecord,
  BrandSectionRecord,
  ChangelogSectionRecord,
  CollectionMetadata,
  DetailSectionRecord,
  FaqSectionRecord,
  FeatureListSectionRecord,
  FeaturedPostsSectionRecord,
  HeroSectionRecord,
  PageModelSectionsField,
  PostRecord,
  PricingSectionRecord,
  RedirectSectionRecord,
  ReviewSectionRecord,
  SiteLocale,
  StatsSectionRecord,
  TeamSectionRecord,
  VideoSectionRecord,
} from '@/graphql/types/graphql';
import GradientHero from '../Home/Hero/GradientHero';
import FeatureCards from '../Home/Features/FeatureCards';
import PostGridRenderer from '../Blog/PostGridRenderer';
import { redirect } from 'next/navigation';
import RightImageHero from '../Home/Hero/RightImageHero';
import BackgroundImageHero from '../Home/Hero/BackgroundImage';
import SplitImage from '../Home/Hero/SplitImage';
import GradientCards from '../Home/Pricing/GradientCards';
import Minimal from '../Home/Pricing/Minimal';
import FeatureListSelector from '../Home/Pricing/FeatureListSelector';
import SmallCards from '../Home/Pricing/SmallCards';
import Carrousel from '../Home/Testimonials/Carrousel';
import ModernCarrousel from '../Home/Testimonials/ModernCarrousel';
import MinimalCarrousel from '../Home/Testimonials/MinimalCarrousel';
import MinimalReviewCards from '../Home/Testimonials/MinimalReviewCards';
import BrandCards from '../Home/Brands/BrandCards';
import ModernPostCards from '../Home/Featured Posts/ModernPostCards';
import CarrouselFeaturedPosts from '../Home/Featured Posts/CarrouselFeaturedPosts';
import MinimalistFeaturedPostsGrid from '../Home/Featured Posts/MinimalistFeaturedPostsGrid';
import FullImageFeaturedPosts from '../Home/Featured Posts/FullImageFeaturedPosts';
import MinimalCardsFeature from '../Home/Features/MinimalCardsFeature';
import BigImageHorizontalFeatures from '../Home/Features/BigImageHorizontalFeatures';
import BigImageVerticalFeatures from '../Home/Features/BigImageVerticalFeatures';
import Changelog from '../Changelog';

type Props = {
  sections: Array<PageModelSectionsField>;
  locale: SiteLocale;
  posts: PostRecord[];
  postMeta: CollectionMetadata;
};

export default function Section({ sections, locale, posts, postMeta }: Props) {
  return (
    <>
      {sections.map((section) => {
        switch (section._modelApiKey) {
          case 'changelog_section':
            const changeLogSection = section as ChangelogSectionRecord;
            return (
              <Changelog
                title={changeLogSection.title}
                subtitle={changeLogSection.subtitle}
                featuredChangeLogs={changeLogSection.featuredVersions}
                locale={locale}
              />
            );
          case 'hero_section':
            const heroSectionRecord = section as HeroSectionRecord;
            switch (heroSectionRecord.displayOptions) {
              case 'gradient':
                return (
                  <GradientHero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    buttons={heroSectionRecord.buttons}
                  />
                );
              case 'right_image':
                return (
                  <RightImageHero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    buttons={heroSectionRecord.buttons}
                    image={heroSectionRecord.heroImage}
                  />
                );
              case 'background_image':
                return (
                  <BackgroundImageHero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    buttons={heroSectionRecord.buttons}
                    image={heroSectionRecord.heroImage}
                  />
                );
              case 'split_image':
                return (
                  <SplitImage
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    buttons={heroSectionRecord.buttons}
                    image={heroSectionRecord.heroImage}
                  />
                );
              default:
                return (
                  <Hero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    buttons={heroSectionRecord.buttons}
                  />
                );
            }

          case 'feature_list_section':
            const featureListSectionRecord =
              section as FeatureListSectionRecord;
            switch (featureListSectionRecord.displayOption) {
              case 'card_minimal':
                return (
                  <MinimalCardsFeature
                    features={featureListSectionRecord.feature}
                    featuresHeader={featureListSectionRecord.featuresHeader}
                    featuresSubheader={
                      featureListSectionRecord.featuresSubheader
                    }
                  />
                );
              case 'grid':
                return (
                  <Features
                    features={featureListSectionRecord.feature}
                    featuresHeader={featureListSectionRecord.featuresHeader}
                    featuresSubheader={
                      featureListSectionRecord.featuresSubheader
                    }
                  />
                );
              case 'big_image_horizontal':
                return (
                  <BigImageHorizontalFeatures
                    features={featureListSectionRecord.feature}
                    featuresHeader={featureListSectionRecord.featuresHeader}
                    featuresSubheader={
                      featureListSectionRecord.featuresSubheader
                    }
                  />
                );
              case 'big_image_vertical':
                return (
                  <BigImageVerticalFeatures
                    features={featureListSectionRecord.feature}
                    featuresHeader={featureListSectionRecord.featuresHeader}
                    featuresSubheader={
                      featureListSectionRecord.featuresSubheader
                    }
                  />
                );
              default:
                return (
                  <FeatureCards
                    features={featureListSectionRecord.feature}
                    featuresHeader={featureListSectionRecord.featuresHeader}
                    featuresSubheader={
                      featureListSectionRecord.featuresSubheader
                    }
                  />
                );
            }

          case 'video_section':
            const videoSectionRecord = section as VideoSectionRecord;
            return (
              <Video
                videoHeader={videoSectionRecord.videoHeader}
                videoSubheader={videoSectionRecord.videoSubheader}
                videoUid={videoSectionRecord.video?.providerUid}
                videoThumbnail={videoSectionRecord.videoThumbnail}
                videoProvider={videoSectionRecord.video?.provider}
              />
            );
          case 'brand_section':
            const brandSectionRecord = section as BrandSectionRecord;
            switch (brandSectionRecord.displayOptions) {
              case 'brand_cards':
                return <BrandCards brandShowcase={brandSectionRecord.brand} />;
              default:
                return <Brands brandShowcase={brandSectionRecord.brand} />;
            }
          case 'detail_section':
            const detailSectionRecord = section as DetailSectionRecord;
            return (
              <DetailSection
                imagePosition={detailSectionRecord.imagePosition as boolean}
                image={detailSectionRecord.image}
                details={detailSectionRecord.details}
              />
            );
          case 'review_section':
            const reviewSectionRecord = section as ReviewSectionRecord;
            switch (reviewSectionRecord.displayOptions) {
              case 'card_carrousel':
                return (
                  <Carrousel
                    header={reviewSectionRecord.reviewSectionHeader}
                    subheader={reviewSectionRecord.reviewSectionSubheader}
                    reviews={reviewSectionRecord.reviews}
                  />
                );
              case 'modern_carrousel':
                return (
                  <ModernCarrousel
                    header={reviewSectionRecord.reviewSectionHeader}
                    subheader={reviewSectionRecord.reviewSectionSubheader}
                    reviews={reviewSectionRecord.reviews}
                  />
                );
              case 'minimal_carrousel':
                return (
                  <MinimalCarrousel
                    header={reviewSectionRecord.reviewSectionHeader}
                    subheader={reviewSectionRecord.reviewSectionSubheader}
                    reviews={reviewSectionRecord.reviews}
                  />
                );
              case 'minimal_cards':
                return (
                  <MinimalReviewCards
                    header={reviewSectionRecord.reviewSectionHeader}
                    subheader={reviewSectionRecord.reviewSectionSubheader}
                    reviews={reviewSectionRecord.reviews}
                  />
                );
              default:
                return (
                  <Testimonials
                    header={reviewSectionRecord.reviewSectionHeader}
                    subheader={reviewSectionRecord.reviewSectionSubheader}
                    reviews={reviewSectionRecord.reviews}
                  />
                );
            }

          case 'pricing_section':
            const pricingSectionRecord = section as PricingSectionRecord;
            switch (pricingSectionRecord.displayOption) {
              case 'cards_gradient':
                return (
                  <GradientCards
                    header={pricingSectionRecord.pricingSectionHeader}
                    subheader={pricingSectionRecord.pricingSectionSubheader}
                    plans={pricingSectionRecord.plans}
                  />
                );
              case 'minimal':
                return (
                  <Minimal
                    header={pricingSectionRecord.pricingSectionHeader}
                    subheader={pricingSectionRecord.pricingSectionSubheader}
                    plans={pricingSectionRecord.plans}
                  />
                );
              case 'feature_list':
                return (
                  <FeatureListSelector
                    header={pricingSectionRecord.pricingSectionHeader}
                    subheader={pricingSectionRecord.pricingSectionSubheader}
                    plans={pricingSectionRecord.plans}
                  />
                );
              case 'mini_cards':
                return (
                  <SmallCards
                    header={pricingSectionRecord.pricingSectionHeader}
                    subheader={pricingSectionRecord.pricingSectionSubheader}
                    plans={pricingSectionRecord.plans}
                  />
                );
              default:
                return (
                  <Pricing
                    header={pricingSectionRecord.pricingSectionHeader}
                    subheader={pricingSectionRecord.pricingSectionSubheader}
                    plans={pricingSectionRecord.plans}
                  />
                );
            }

          case 'featured_posts_section':
            const featuredPostsSectionRecord =
              section as FeaturedPostsSectionRecord;
            switch (featuredPostsSectionRecord.displayOptions) {
              case 'modern_cards':
                return (
                  <ModernPostCards
                    locale={locale}
                    blogData={featuredPostsSectionRecord.featuredPosts}
                    blogHeader={featuredPostsSectionRecord.featuredPostsHeader}
                    blogSubheader={
                      featuredPostsSectionRecord.featuredPostsSubheader
                    }
                  />
                );
              case 'carrousel':
                return (
                  <CarrouselFeaturedPosts
                    locale={locale}
                    blogData={featuredPostsSectionRecord.featuredPosts}
                    blogHeader={featuredPostsSectionRecord.featuredPostsHeader}
                    blogSubheader={
                      featuredPostsSectionRecord.featuredPostsSubheader
                    }
                  />
                );
              case 'minimalist_grid':
                return (
                  <MinimalistFeaturedPostsGrid
                    locale={locale}
                    blogData={featuredPostsSectionRecord.featuredPosts}
                    blogHeader={featuredPostsSectionRecord.featuredPostsHeader}
                    blogSubheader={
                      featuredPostsSectionRecord.featuredPostsSubheader
                    }
                  />
                );
              case 'full_image_card':
                return (
                  <FullImageFeaturedPosts
                    locale={locale}
                    blogData={featuredPostsSectionRecord.featuredPosts}
                    blogHeader={featuredPostsSectionRecord.featuredPostsHeader}
                    blogSubheader={
                      featuredPostsSectionRecord.featuredPostsSubheader
                    }
                  />
                );
              default:
                return (
                  <Blog
                    locale={locale}
                    blogData={featuredPostsSectionRecord.featuredPosts}
                    blogHeader={featuredPostsSectionRecord.featuredPostsHeader}
                    blogSubheader={
                      featuredPostsSectionRecord.featuredPostsSubheader
                    }
                  />
                );
            }

          case 'team_section':
            const teamSectionRecord = section as TeamSectionRecord;
            if (teamSectionRecord.displayOptions === 'compact')
              return (
                <CompactTeam
                  header={teamSectionRecord.title}
                  subheader={teamSectionRecord.subtitle}
                  members={teamSectionRecord.showcasedMembers}
                  lng={locale}
                />
              );
            return (
              <ExpandedTeam
                header={teamSectionRecord.title}
                subheader={teamSectionRecord.subtitle}
                members={teamSectionRecord.showcasedMembers}
                lng={locale}
              />
            );
          case 'faq_section':
            const faqSectionRecord = section as FaqSectionRecord;
            if (faqSectionRecord.displayOptions === 'accordion')
              return (
                <FAQAccordion
                  title={faqSectionRecord.title}
                  subtitle={faqSectionRecord.subtitle}
                  questions={faqSectionRecord.questions}
                />
              );
            return (
              <FAQGrid
                title={faqSectionRecord.title}
                subtitle={faqSectionRecord.subtitle}
                questions={faqSectionRecord.questions}
              />
            );
          case 'stats_section':
            const statsSectionRecord = section as StatsSectionRecord;
            return (
              <StatsSection
                title={statsSectionRecord.title}
                subtitle={statsSectionRecord.subtitle}
                statistic={statsSectionRecord.statistic}
              />
            );
          case 'about_intro':
            const aboutIntroSectionRecord = section as AboutIntroRecord;
            return (
              <AboutIntro
                header={aboutIntroSectionRecord.header}
                subheader={aboutIntroSectionRecord.subheader}
                introduction={aboutIntroSectionRecord.introductionText}
                images={aboutIntroSectionRecord.images}
                preHeader={aboutIntroSectionRecord.preHeader}
              />
            );
          case 'all_posts_section':
            const allPostsSectionRecord = section as AllPostsSectionRecord;
            return (
              <PostGridRenderer data={posts} lng={locale} postMeta={postMeta} />
            );
          case 'redirect_section':
            const redirectSectionRecord = section as RedirectSectionRecord;
            redirect(`/${locale}/${redirectSectionRecord.slugToRedirectTo}`);
          default:
            return <></>;
        }
      })}
    </>
  );
}
