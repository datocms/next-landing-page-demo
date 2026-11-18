import { notFound } from 'next/navigation';
import PostsPageHeader from '@/components/posts/PostsPageHeader';
import AboutIntro from '@/components/sections/AboutIntro';
import AllPostsSection from '@/components/sections/AllPostsSection';
import BrandSection from '@/components/sections/BrandSection';
import ChangelogSection from '@/components/sections/ChangelogSection';
import CtaSection from '@/components/sections/CtaSection';
import DetailSection from '@/components/sections/DetailSection';
import FaqSection from '@/components/sections/FaqSection';
import FeaturedPostsSection from '@/components/sections/FeaturedPostsSection';
import FeatureListSection from '@/components/sections/FeatureListSection';
import HeroSection from '@/components/sections/HeroSection';
import IntegrationsSection from '@/components/sections/IntegrationsSection';
import PricingComparisonSection from '@/components/sections/PricingComparisonSection';
import PricingSection from '@/components/sections/PricingSection';
import ReviewSection from '@/components/sections/ReviewSection';
import StatsSection from '@/components/sections/StatsSection';
import StepsSection from '@/components/sections/StepsSection';
import TeamSection from '@/components/sections/TeamSection';
import TimelineSection from '@/components/sections/TimelineSection';
import VideoSection from '@/components/sections/VideoSection';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import type { PageProps, Query } from './meta';

/**
 * A page is a stack of section blocks (the Page model's "Sections" field).
 * Each block type has its own component in components/sections/, which also
 * picks the block's layout from its display options field.
 */
const Content: ContentComponent<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { page } = data;
  if (!page) {
    notFound();
  }

  const { locale } = globalPageProps.params;

  // Sections have no headers of their own: a page that does not open with a
  // hero, the about intro or the posts list shows its title as the h1 instead
  const opener = page.sections[0]?.__typename;
  const hasOwnTitle =
    opener === 'HeroSectionBlockRecord' ||
    opener === 'AboutIntroBlockRecord' ||
    opener === 'AllPostsSectionBlockRecord';

  const sections = page.sections.map((section, index) => {
    // The opener that carries the page's title takes the h1
    const as = hasOwnTitle && index === 0 ? 'h1' : 'h2';
    const key = section.id;

    switch (section.__typename) {
      case 'HeroSectionBlockRecord':
        return <HeroSection key={key} fragment={section} locale={locale} />;
      case 'FeatureListSectionBlockRecord':
        return (
          <FeatureListSection key={key} fragment={section} locale={locale} />
        );
      case 'VideoSectionBlockRecord':
        return (
          <VideoSection key={key} fragment={section} locale={locale} as={as} />
        );
      case 'BrandSectionBlockRecord':
        return <BrandSection key={key} fragment={section} locale={locale} />;
      case 'DetailSectionBlockRecord':
        return <DetailSection key={key} fragment={section} as={as} />;
      case 'TestimonialSectionBlockRecord':
        return <ReviewSection key={key} fragment={section} locale={locale} />;
      case 'PricingSectionBlockRecord':
        return <PricingSection key={key} fragment={section} locale={locale} />;
      case 'PricingComparisonSectionBlockRecord':
        return (
          <PricingComparisonSection
            key={key}
            fragment={section}
            locale={locale}
          />
        );
      case 'FeaturedPostsSectionBlockRecord':
        return (
          <FeaturedPostsSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
          />
        );
      case 'TeamSectionBlockRecord':
        return (
          <TeamSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
          />
        );
      case 'FaqSectionBlockRecord':
        return <FaqSection key={key} fragment={section} />;
      case 'StatsSectionBlockRecord':
        return <StatsSection key={key} fragment={section} locale={locale} />;
      case 'StepsSectionBlockRecord':
        return <StepsSection key={key} fragment={section} locale={locale} />;
      case 'TimelineSectionBlockRecord':
        return <TimelineSection key={key} fragment={section} />;
      case 'IntegrationSectionBlockRecord':
        return <IntegrationsSection key={key} fragment={section} />;
      case 'CtaSectionBlockRecord':
        return <CtaSection key={key} fragment={section} as={as} />;
      case 'AboutIntroBlockRecord':
        return <AboutIntro key={key} fragment={section} as={as} />;
      case 'ChangelogSectionBlockRecord':
        return (
          <ChangelogSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
          />
        );
      case 'AllPostsSectionBlockRecord':
        return (
          <AllPostsSection
            key={key}
            posts={data.allPosts}
            postCount={data._allPostsMeta.count}
            topics={data.topics.filter(
              (topic) => topic._allReferencingPostsMeta.count > 0,
            )}
            pageTitle={page.title}
            globalPageProps={globalPageProps}
            as={as}
          />
        );
      default:
        return null;
    }
  });

  return (
    <>
      {!hasOwnTitle && <PostsPageHeader title={page.title} />}
      {sections}
    </>
  );
};

export default Content;
