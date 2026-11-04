import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanName from '@/components/sections/PricingSection/PlanName';
import Price from '@/components/sections/PricingSection/Price';
import type { FeatureRow } from '@/components/sections/PricingSection/plans';
import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import type { Tone } from '@/utils/tones';
import CoverageRing from './CoverageRing';
import FeaturePill from './FeaturePill';

type Plan = ResultOf<typeof PricingSectionFragment>['plans'][number];

type Props = {
  plan: Plan;
  features: FeatureRow[];
  tone: Tone;
  locale: string;
  headingId: string;
  headingLevel: ItemHeadingLevel;
};

/** The selected plan: its details on the left, a coverage ring over its feature pills on the right */
const PlanPanel = ({
  plan,
  features,
  tone,
  locale,
  headingId,
  headingLevel,
}: Props) => {
  const includedCount = features.filter((feature) => feature.included).length;

  return (
    <article
      aria-labelledby={headingId}
      className="card grid gap-8 p-6 md:grid-cols-12 md:gap-6 md:p-8"
    >
      <div className="md:col-span-5">
        <div className="flex items-center gap-2.5">
          <PlanName headingLevel={headingLevel} id={headingId} tone={tone}>
            {plan.tierName}
          </PlanName>
        </div>
        <div className="mt-2 max-w-[44ch] text-body text-ink-2 leading-[1.55] [&_p+p]:mt-2">
          <DatoStructuredText data={plan.tierDescription} />
        </div>
        <Price
          className="mt-6"
          monthly={plan.monthlyPrice}
          yearly={plan.yearlyPrice}
          locale={locale}
        />
        <button
          type="button"
          className="btn btn-primary mt-6 px-6 max-md:h-12 max-md:w-full"
        >
          {plan.ctaLabel || uiString(locale, 'choosePlan')}
        </button>
      </div>

      {features.length > 0 && (
        <div className="border-line max-md:border-t max-md:pt-8 md:col-span-7 md:border-l md:pl-8">
          <CoverageRing included={includedCount} total={features.length} />
          <ul className="mt-5 flex flex-wrap gap-2">
            {features.map((feature) => (
              <FeaturePill
                key={feature.key}
                text={feature.text}
                included={feature.included}
                locale={locale}
              />
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default PlanPanel;
