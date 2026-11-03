import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import ReactMarkdown from 'react-markdown';
import FeatureIcon from '@/components/sections/FeatureListSection/FeatureIcon';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { MINI_UIS } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';
import GalleryScroller from './GalleryScroller';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
  locale: string;
};

type Feature = ResultOf<typeof FeatureListSectionFragment>['feature'][number];

/** One gallery card: the feature's mini-UI on a tone glow, then its icon, title and copy */
const FeatureCard = ({
  feature,
  index,
  ItemHeading,
}: {
  feature: Feature;
  /** Position in the list: picks the tone and the mini-UI */
  index: number;
  ItemHeading: 'h2' | 'h3';
}) => {
  const MiniUi = MINI_UIS[index % MINI_UIS.length];

  return (
    <li
      className={cn(
        'card flex min-h-[360px] w-[368px] snap-start flex-col p-2 max-md:min-h-[340px] max-md:w-[300px]',
        toneClass(index),
      )}
    >
      <div className="zone-glow grid h-[200px] place-items-center overflow-hidden rounded-zone max-md:h-[170px]">
        <MiniUi className="size-full" />
      </div>
      <div className="px-[15px] pt-[18px] pb-5">
        <div className="flex items-center gap-2.5">
          {/* -my-px fits the 24px icon into the title's 22px line, so every title row is the same height */}
          <div className="-my-px shrink-0">
            <FeatureIcon
              image={feature.featureIcon?.responsiveImage}
              size="sm"
            />
          </div>
          <ItemHeading className="min-w-0 text-h3">
            {feature.featureTitle}
          </ItemHeading>
        </div>
        {feature.featureDescription && (
          <div className="mt-2 text-[15px] leading-[1.55] text-ink-2 [&_p+p]:mt-2">
            <ReactMarkdown>{feature.featureDescription}</ReactMarkdown>
          </div>
        )}
      </div>
    </li>
  );
};

/**
 * Default feature list ("card"): the gallery. A scroll-snap track of white
 * cards that bleeds off the right edge; each card leads with a wordless
 * mini-UI on a tone glow, then the CMS icon, title and copy. The head and the
 * controls live in the GalleryScroller island; everything else renders here.
 */
const GalleryFeatures = ({ fragment, as = 'h2', locale }: Props) => {
  const headingId = useId();
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = readFragment(FeatureListSectionFragment, fragment);
  // Item titles sit one level below the section title
  const ItemHeading = as === 'h1' ? 'h2' : 'h3';
  const trackLabel =
    stripStega(featuresHeader ?? '').trim() || uiString(locale, 'features');

  const heading = (
    <SectionTitle
      as={as}
      h1Size="section"
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
              ItemHeading={ItemHeading}
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
