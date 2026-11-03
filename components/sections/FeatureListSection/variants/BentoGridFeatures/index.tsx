import { useId } from 'react';
import ReactMarkdown from 'react-markdown';
import FeatureIcon from '@/components/sections/FeatureListSection/FeatureIcon';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { MINI_UIS } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';
import { bentoSpans, MD_SPAN, XL_SPAN } from './bentoSpans';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * "grid" feature list: the bento. Tinted cells with mixed spans (4 columns
 * from 1200, 2 from 768). Each cell lays itself out by its own width: a
 * narrow cell stacks a white mini-UI zone above the copy (from 768 the zone
 * and its drawing run off the cell's right edge, scaled with the cell); a
 * wide one puts the copy beside a dot-grid canvas. The mini-UIs move once on
 * hover (pointer and motion users only, styles/sections/features-brands.css).
 */
const BentoGridFeatures = ({ fragment, as = 'h2' }: Props) => {
  const headingId = useId();
  const {
    feature: features,
    featuresHeader,
    featuresSubheader,
  } = readFragment(FeatureListSectionFragment, fragment);
  // Item titles sit one level below the section title
  const ItemHeading = as === 'h1' ? 'h2' : 'h3';
  const xlSpans = bentoSpans(features.length, 4);
  const mdSpans = bentoSpans(features.length, 2);

  return (
    <section
      id="features"
      className="section"
      aria-labelledby={featuresHeader ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          as={as}
          gap="lg"
          id={headingId}
          title={featuresHeader}
          paragraph={featuresSubheader}
        />

        {features.length > 0 && (
          <ul className="fb-bento reveal-stagger grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:auto-rows-[minmax(326px,auto)] xl:grid-cols-4">
            {features.map((feature, i) => {
              const MiniUi = MINI_UIS[i % MINI_UIS.length];
              return (
                <li
                  key={feature.id}
                  className={cn(
                    '@container relative overflow-hidden rounded-card border border-line bg-well p-2',
                    MD_SPAN[mdSpans[i]],
                    XL_SPAN[xlSpans[i]],
                    toneClass(i),
                  )}
                >
                  <div className="flex h-full flex-col @min-[30rem]:flex-row-reverse @min-[30rem]:gap-2">
                    <div
                      aria-hidden="true"
                      className="relative -me-6 h-[clamp(148px,calc(62cqw-20px),240px)] shrink-0 overflow-hidden rounded-zone border border-line bg-white max-md:me-0 max-md:h-[132px] @min-[30rem]:me-0 @min-[30rem]:grid @min-[30rem]:h-auto @min-[30rem]:min-h-[280px] @min-[30rem]:flex-1 @min-[30rem]:place-items-center @min-[30rem]:dot-grid"
                    >
                      <MiniUi className="absolute top-1/2 left-0 h-[clamp(168px,62cqw,260px)] w-auto -translate-y-1/2 max-md:left-1/2 max-md:h-[152px] max-md:-translate-x-1/2 @min-[30rem]:static @min-[30rem]:h-auto @min-[30rem]:w-full @min-[30rem]:max-w-[352px] @min-[30rem]:translate-0" />
                    </div>
                    <div className="mt-auto px-3 pt-4 pb-3 max-md:px-2 max-md:pt-3.5 max-md:pb-2 @min-[30rem]:w-[256px] @min-[30rem]:shrink-0 @min-[30rem]:self-end @min-[30rem]:py-3 @min-[40rem]:w-[280px]">
                      <div className="flex items-center gap-2.5">
                        <FeatureIcon
                          image={feature.featureIcon?.responsiveImage}
                          size="sm"
                        />
                        <ItemHeading className="min-w-0 text-h4">
                          {feature.featureTitle}
                        </ItemHeading>
                      </div>
                      {feature.featureDescription && (
                        <div className="mt-1.5 text-[15px] leading-[1.5] text-ink-2 [&_p+p]:mt-2">
                          <ReactMarkdown>
                            {feature.featureDescription}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BentoGridFeatures;
