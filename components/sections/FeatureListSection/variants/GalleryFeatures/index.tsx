import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import FeatureCard from './FeatureCard';
import GalleryScroller from './GalleryScroller';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  as?: SectionHeadingLevel;
  locale: string;
};

/**
 * The default layout (`card`): a scroll-snap gallery of feature cards that
 * bleeds off the right edge. The head and controls live in the
 * GalleryScroller island; the cards render here.
 */
const GalleryFeatures = ({ fragment, as = 'h2', locale }: Props) => {
  const headingId = useId();
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = readFragment(FeatureListSectionFragment, fragment);
  const trackLabel =
    stripStega(featuresHeader).trim() || uiString(locale, 'features');

  const heading = (
    <SectionTitle
      as={as}
      gap="none"
      id={headingId}
      title={featuresHeader}
      paragraph={featuresSubheader}
    />
  );

  return (
    <section
      className="section overflow-x-clip"
      aria-labelledby={featuresHeader ? headingId : undefined}
    >
      {features.length > 0 ? (
        <GalleryScroller
          heading={heading}
          label={trackLabel}
          count={features.length}
          locale={locale}
        >
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={i}
              headingLevel={itemHeadingLevel(as)}
            />
          ))}
        </GalleryScroller>
      ) : (
        <div className="container-page">{heading}</div>
      )}
    </section>
  );
};

export default GalleryFeatures;
