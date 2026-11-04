import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import FeatureMedia from '@/components/sections/FeatureListSection/FeatureMedia';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { toneClass } from '@/utils/tones';
import { twoDigits } from '@/utils/twoDigits';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * `big_image_horizontal`: two-up cards, each led by a media well holding the
 * CMS image (FeatureMedia), then an index, title and copy.
 */
const BigImageHorizontalFeatures = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = readFragment(FeatureListSectionFragment, fragment);
  const ItemHeading = itemHeadingLevel(as);

  return (
    <section
      className="section"
      aria-labelledby={featuresHeader ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          as={as}
          h1Size="page"
          align="split"
          twoTone={false}
          id={headingId}
          title={featuresHeader}
          paragraph={featuresSubheader}
        />

        {features.length > 0 && (
          <ul className="reveal-stagger grid gap-4 max-md:gap-3 lg:grid-cols-2">
            {features.map((feature, i) => (
              <li
                key={feature.id}
                className={cn(
                  'card grid grid-cols-[240px_minmax(0,1fr)] p-2 max-sm:grid-cols-[104px_minmax(0,1fr)] max-sm:items-center max-sm:gap-4 lg:grid-cols-[clamp(176px,42%,240px)_minmax(0,1fr)]',
                  toneClass(i),
                )}
              >
                <div className="zone-glow relative grid min-h-[200px] place-items-center rounded-zone [--media-tile-size:110px] max-sm:size-[104px] max-sm:min-h-0 max-sm:rounded-[14px] max-sm:[--media-tile-inner-radius:9px] max-sm:[--media-tile-padding:4px] max-sm:[--media-tile-radius:12px] max-sm:[--media-tile-size:56px]">
                  <FeatureMedia
                    image={feature.featureIcon?.responsiveImage}
                    index={i}
                    sizes="(min-width: 640px) 240px, 104px"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center p-6 max-sm:py-2 max-sm:ps-0 max-sm:pe-2 lg:max-xl:p-5">
                  <span aria-hidden="true" className="mono">
                    {twoDigits(i + 1)}
                  </span>
                  <ItemHeading className="mt-3 text-h3 max-sm:mt-1.5 max-sm:text-h4">
                    {feature.featureTitle}
                  </ItemHeading>
                  {hasStructuredText(feature.featureDescription) && (
                    <div className="mt-2 text-[15px] leading-[1.55] text-ink-2 max-sm:mt-1 [&_p+p]:mt-2">
                      <DatoStructuredText data={feature.featureDescription} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BigImageHorizontalFeatures;
