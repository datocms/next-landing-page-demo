import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import FeatureMedia from '@/components/sections/FeatureListSection/FeatureMedia';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { toneClass } from '@/utils/tones';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * "big_image_horizontal" feature list: media rows. Two-up horizontal cards,
 * each led by a glowing media well that holds the CMS image (a floating tile
 * for icon art, a cover photo otherwise), then a mono index, title and copy.
 * Below 640 every card becomes a compact row with a square well.
 */
const BigImageHorizontalFeatures = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = readFragment(FeatureListSectionFragment, fragment);
  // Item titles sit one level below the section title
  const ItemHeading = as === 'h1' ? 'h2' : 'h3';

  return (
    <section
      className="section"
      aria-labelledby={featuresHeader ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          as={as}
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
                <div className="zone-glow relative grid min-h-[200px] place-items-center rounded-zone [--tile:110px] max-sm:size-[104px] max-sm:min-h-0 max-sm:rounded-[14px] max-sm:[--tile-ir:9px] max-sm:[--tile-p:4px] max-sm:[--tile-r:12px] max-sm:[--tile:56px]">
                  <FeatureMedia
                    image={feature.featureIcon?.responsiveImage}
                    index={i}
                    sizes="(min-width: 640px) 240px, 104px"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center p-6 max-sm:py-2 max-sm:ps-0 max-sm:pe-2 lg:max-xl:p-5">
                  <span aria-hidden="true" className="mono">
                    {String(i + 1).padStart(2, '0')}
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
