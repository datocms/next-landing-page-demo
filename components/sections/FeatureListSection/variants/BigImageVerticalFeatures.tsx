import { useId } from 'react';
import ReactMarkdown from 'react-markdown';
import FeatureMedia from '@/components/sections/FeatureListSection/FeatureMedia';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { toneClass } from '@/utils/tones';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * "big_image_vertical" feature list: figure columns. Open columns with no
 * cards, split by hairlines (no outer borders). Each leads with a figure: a
 * white dot-grid canvas with a soft accent glow and the CMS image as a
 * floating tile (a cover photo, or the feature's mini-UI without an image),
 * then a mono index, title and copy.
 */
const BigImageVerticalFeatures = ({ fragment, as = 'h2' }: Props) => {
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
          twoTone={false}
          gap="lg"
          id={headingId}
          title={featuresHeader}
          paragraph={featuresSubheader}
        />

        {features.length > 0 && (
          <ul className="fig-cols reveal grid md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <li
                key={feature.id}
                className={cn('flex flex-col', toneClass(i))}
              >
                <div className="relative isolate grid h-[200px] place-items-center overflow-hidden rounded-zone border border-line bg-white [--tile:120px] max-md:h-[140px] max-md:[--tile:88px]">
                  {/* A soft accent glow, with the dot grid drawn over it */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,var(--g-100),transparent)]"
                  />
                  <span
                    aria-hidden="true"
                    className="fig-canvas absolute inset-0 -z-10"
                  />
                  <FeatureMedia
                    image={feature.featureIcon?.responsiveImage}
                    index={i}
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <span aria-hidden="true" className="mono mt-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ItemHeading className="mt-2 text-h3">
                  {feature.featureTitle}
                </ItemHeading>
                {feature.featureDescription && (
                  <div className="mt-1.5 max-w-[42ch] text-[15px] leading-[1.6] text-ink-2 [&_p+p]:mt-2">
                    <ReactMarkdown>{feature.featureDescription}</ReactMarkdown>
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
