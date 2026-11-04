import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import FeatureIcon from '@/components/sections/FeatureListSection/FeatureIcon';
import type { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { MINI_UIS } from '@/components/ui/Ornaments';
import type { ResultOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import { hasStructuredText } from '@/utils/structuredText';
import { toneClass } from '@/utils/tones';

type Props = {
  feature: ResultOf<typeof FeatureListSectionFragment>['feature'][number];
  /** Position in the list: picks the tone and the mini-UI */
  index: number;
  headingLevel: ItemHeadingLevel;
};

/** One gallery card: the feature's mini-UI on a tone glow, then its icon, title and copy */
const FeatureCard = ({ feature, index, headingLevel: Heading }: Props) => {
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
          <Heading className="min-w-0 text-h3">{feature.featureTitle}</Heading>
        </div>
        {hasStructuredText(feature.featureDescription) && (
          <div className="mt-2 text-[15px] leading-[1.55] text-ink-2 [&_p+p]:mt-2">
            <DatoStructuredText data={feature.featureDescription} />
          </div>
        )}
      </div>
    </li>
  );
};

export default FeatureCard;
