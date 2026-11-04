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
 * `big_image_vertical`: open columns split by hairlines, each led by a
 * dot-grid figure holding the CMS image (FeatureMedia), then an index, title
 * and copy.
 */
const BigImageVerticalFeatures = ({ fragment, as = 'h2' }: Props) => {
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
          twoTone={false}
          gap="lg"
          id={headingId}
          title={featuresHeader}
          paragraph={featuresSubheader}
        />

        {features.length > 0 && (
          <ul className="figure-columns reveal grid md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <li
                key={feature.id}
                className={cn('flex flex-col', toneClass(i))}
              >
                <div className="relative isolate grid h-[200px] place-items-center overflow-hidden rounded-zone border border-line bg-white [--media-tile-size:120px] max-md:h-[140px] max-md:[--media-tile-size:88px]">
                  {/* A soft accent glow, with the dot grid drawn over it */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,var(--g-100),transparent)]"
                  />
                  <span
                    aria-hidden="true"
                    className="figure-canvas absolute inset-0 -z-10"
                  />
                  <FeatureMedia
                    image={feature.featureIcon?.responsiveImage}
                    index={i}
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <span aria-hidden="true" className="mono mt-4">
                  {twoDigits(i + 1)}
                </span>
                <ItemHeading className="mt-2 text-h3">
                  {feature.featureTitle}
                </ItemHeading>
                {hasStructuredText(feature.featureDescription) && (
                  <div className="mt-1.5 max-w-[42ch] text-[15px] leading-[1.6] text-ink-2 [&_p+p]:mt-2">
                    <DatoStructuredText data={feature.featureDescription} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BigImageVerticalFeatures;
