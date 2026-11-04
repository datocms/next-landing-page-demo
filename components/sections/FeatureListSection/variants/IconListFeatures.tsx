import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import FeatureIcon from '@/components/sections/FeatureListSection/FeatureIcon';
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

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  as?: SectionHeadingLevel;
};

/** `card_minimal`: a sticky head beside a two-column hairline list of icon rows */
const IconListFeatures = ({ fragment, as = 'h2' }: Props) => {
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
      <div className="container-page grid-page items-start gap-y-10 max-md:gap-y-8">
        <div className="col-span-full lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-4 xl:col-span-5">
          <SectionTitle
            as={as}
            twoTone={false}
            gap="none"
            id={headingId}
            title={featuresHeader}
            paragraph={featuresSubheader}
            className="[--lead-max:44ch]"
          />
          <span
            aria-hidden="true"
            className="reveal mt-8 block h-[3px] w-24 rounded-full bg-grad-line max-md:mt-6"
          />
        </div>

        {features.length > 0 && (
          <ul className="reveal-stagger col-span-full grid gap-x-8 md:grid-cols-2 lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6">
            {features.map((feature, i) => (
              <li
                key={feature.id}
                className={cn(
                  'flex gap-4 border-t border-line py-6 max-md:gap-3.5 max-md:py-5',
                  toneClass(i),
                )}
              >
                <FeatureIcon
                  image={feature.featureIcon?.responsiveImage}
                  size="md"
                />
                <div className="min-w-0 pt-[9px] max-md:pt-[7px]">
                  <ItemHeading className="text-h3">
                    {feature.featureTitle}
                  </ItemHeading>
                  {hasStructuredText(feature.featureDescription) && (
                    <div className="mt-1.5 max-w-[46ch] text-[15px] leading-[1.6] text-ink-2 [&_p+p]:mt-2">
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

export default IconListFeatures;
