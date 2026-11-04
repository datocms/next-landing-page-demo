import { stripStega } from '@datocms/content-link';
import { notFound, redirect } from 'next/navigation';
import AboutIntro from '@/components/sections/AboutIntro';
import AllPostsSection from '@/components/sections/AllPostsSection';
import BrandSection from '@/components/sections/BrandSection';
import ChangelogSection from '@/components/sections/ChangelogSection';
import DetailSection from '@/components/sections/DetailSection';
import FaqSection from '@/components/sections/FaqSection';
import FeaturedPostsSection from '@/components/sections/FeaturedPostsSection';
import FeatureListSection from '@/components/sections/FeatureListSection';
import HeroSection from '@/components/sections/HeroSection';
import PricingComparisonSection from '@/components/sections/PricingComparisonSection';
import PricingSection from '@/components/sections/PricingSection';
import ReviewSection from '@/components/sections/ReviewSection';
import StatsSection from '@/components/sections/StatsSection';
import TeamSection from '@/components/sections/TeamSection';
import VideoSection from '@/components/sections/VideoSection';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import { pageUrl } from '@/utils/routes';
import type { PageProps, Query } from './meta';

/**
 * A page is a stack of section blocks (the Page model's "Sections" field).
 * Each block type has its own component in components/sections/, which also
 * picks the block's layout from its display option field.
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

  return page.sections.map((section, index) => {
    // A section that opens a page without a hero carries the page's h1
    const as = index === 0 ? 'h1' : 'h2';
    const key = section.id;

    switch (section.__typename) {
      case 'HeroSectionRecord':
        return <HeroSection key={key} fragment={section} />;
      case 'FeatureListSectionRecord':
        return (
          <FeatureListSection
            key={key}
            fragment={section}
            locale={locale}
            as={as}
          />
        );
      case 'VideoSectionRecord':
        return (
          <VideoSection key={key} fragment={section} locale={locale} as={as} />
        );
      case 'BrandSectionRecord':
        return <BrandSection key={key} fragment={section} locale={locale} />;
      case 'DetailSectionRecord':
        return <DetailSection key={key} fragment={section} as={as} />;
      case 'ReviewSectionRecord':
        return (
          <ReviewSection key={key} fragment={section} locale={locale} as={as} />
        );
      case 'PricingSectionRecord':
        return (
          <PricingSection
            key={key}
            fragment={section}
            locale={locale}
            as={as}
          />
        );
      case 'PricingComparisonSectionRecord':
        return (
          <PricingComparisonSection
            key={key}
            fragment={section}
            locale={locale}
            as={as}
          />
        );
      case 'FeaturedPostsSectionRecord':
        return (
          <FeaturedPostsSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
            as={as}
          />
        );
      case 'TeamSectionRecord':
        return (
          <TeamSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
            as={as}
          />
        );
      case 'FaqSectionRecord':
        return <FaqSection key={key} fragment={section} as={as} />;
      case 'StatsSectionRecord':
        return <StatsSection key={key} fragment={section} as={as} />;
      case 'AboutIntroRecord':
        return <AboutIntro key={key} fragment={section} as={as} />;
      case 'ChangelogSectionRecord':
        return (
          <ChangelogSection
            key={key}
            fragment={section}
            globalPageProps={globalPageProps}
            as={as}
          />
        );
      case 'AllPostsSectionRecord':
        return (
          <AllPostsSection
            key={key}
            posts={data.allPosts}
            postCount={data._allPostsMeta.count}
            pageLabel={page.label}
            globalPageProps={globalPageProps}
            as={as}
          />
        );
      case 'RedirectSectionRecord':
        // A page made of a redirect block forwards to another page.
        // stripStega: Content Link markers would end up in the URL
        return redirect(
          pageUrl(globalPageProps, stripStega(section.slugToRedirectTo)),
        );
      default:
        return null;
    }
  });
};

export default Content;
