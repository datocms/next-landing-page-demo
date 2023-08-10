import Blog from '../Blog';
import Brands from '../Brands';
import Features from '../Features';
import Hero from '../Hero';
import Pricing from '../Pricing';
import Testimonials from '../Testimonials';
import Video from '../Video';
import DetailSection from '../Detail/DetailSection';
import Team from '../About/CompactTeam';
import CompactTeam from '../About/CompactTeam';
import ExpandedTeam from '../About/ExpandedTeam';
import FAQAccordion from '../About/FAQAccordion';
import FAQGrid from '../About/FAQGrid';
import StatsSection from '../About/StatsSection';
import { draftMode } from 'next/headers';

export default function Section({
  sections,
  locale,
}: {
  sections: Array<any>;
  locale: string;
}) {
  return (
    <>
      {sections.map((section) => {
        switch (section._modelApiKey) {
          case 'hero_section':
            return (
              <Hero
                heroTitle={section.heroTitle}
                heroSubtitle={section.heroSubtitle}
                buttons={section.buttons}
              />
            );
          case 'feature_list_section':
            return (
              <Features
                features={section.feature}
                featuresHeader={section.featuresHeader}
                featuresSubheader={section.featuresSubheader}
              />
            );
          case 'video_section':
            return (
              <Video
                videoHeader={section.videoHeader}
                videoSubheader={section.videoSubheader}
                videoUid={section.video.providerUid}
                videoThumbnail={section.video.thumbnailUrl}
                videoProvider={section.video.provider}
              />
            );
          case 'brand_section':
            return <Brands brandShowcase={section.brand} />;
          case 'detail_section':
            return (
              <DetailSection
                imagePosition={section.imagePosition}
                imageURL={section.image.url}
                details={section.details}
              />
            );
          case 'review_section':
            return (
              <Testimonials
                header={section.reviewSectionHeader}
                subheader={section.reviewSectionSubheader}
                reviews={section.review}
              />
            );
          case 'pricing_section':
            return (
              <Pricing
                header={section.pricingSectionHeader}
                subheader={section.pricingSectionSubheader}
                plans={section.plans}
              />
            );
          case 'featured_posts_section':
            return (
              <Blog
                locale={locale}
                blogData={section.featuredPosts}
                blogHeader={section.featuredPostsHeader}
                blogSubheader={section.featuredPostsSubheader}
              />
            );
          case 'team_section':
            console.log(section.displayOptions);
            if (section.displayOptions === 'compact')
              return (
                <CompactTeam
                  header={section.title}
                  subheader={section.subtitle}
                  members={section.showcasedMembers}
                />
              );
            return (
              <ExpandedTeam
                header={section.title}
                subheader={section.subtitle}
                members={section.showcasedMembers}
              />
            );
          case 'faq_section':
            if (section.displayOptions === 'accordion')
              return (
                <FAQAccordion
                  title={section.title}
                  subtitle={section.subtitle}
                  questions={section.questions}
                />
              );
            return (
              <FAQGrid
                title={section.title}
                subtitle={section.subtitle}
                questions={section.questions}
              />
            );
          case 'stats_section':
            return (
              <StatsSection
                title={section.title}
                subtitle={section.subtitle}
                statistic={section.statistic}
              />
            );
          default:
            return <></>;
        }
      })}
    </>
  );
}
