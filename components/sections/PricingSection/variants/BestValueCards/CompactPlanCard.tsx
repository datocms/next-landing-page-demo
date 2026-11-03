import { stripStega } from '@datocms/content-link';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanDot from '@/components/sections/PricingSection/PlanDot';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import Price, { PriceTag } from '@/components/sections/PricingSection/Price';
import { splitFeatures } from '@/components/sections/PricingSection/plans';
import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import type { Tone } from '@/utils/tones';

type Plan = ResultOf<typeof PricingSectionFragment>['plans'][number];

type Props = {
  plan: Plan;
  tone: Tone;
  locale: string;
  headingId: string;
  /** The plan name's heading level */
  heading: 'h2' | 'h3';
};

/** A plan beside the best-value well: name and price on one row, its own features, a small CTA */
const CompactPlanCard = ({
  plan,
  tone,
  locale,
  headingId,
  heading: PlanHeading,
}: Props) => {
  const features = splitFeatures(plan.planFeatures);

  return (
    <article aria-labelledby={headingId} className="card flex flex-col p-6">
      {/* Name and price share a row; the description runs under them, the yearly line beside it */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <PlanDot tone={tone} />
          <PlanHeading id={headingId} className="text-h3 text-ink">
            {plan.tierName}
          </PlanHeading>
        </div>
        <Price
          size="md"
          className="shrink-0"
          monthly={plan.monthlyPrice}
          locale={locale}
        />
      </div>
      <div className="mt-1.5 flex items-start justify-between gap-4">
        <div className="line-clamp-3 min-w-0 max-w-[44ch] text-ink-2 text-small">
          <DatoStructuredText data={plan.tierDescription} />
        </div>
        <PriceTag
          className="mt-1 shrink-0"
          yearly={plan.yearlyPrice}
          locale={locale}
        />
      </div>

      {features.length > 0 && (
        <ul className="mt-4 grid items-start gap-x-4 sm:grid-cols-2 md:max-lg:grid-cols-1">
          {features.map((feature) => (
            <PlanFeature
              key={`${plan.id}-${stripStega(feature)}`}
              size="sm"
              text={feature}
              included
              locale={locale}
            />
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <button
          type="button"
          className="btn btn-secondary btn-sm max-sm:w-full"
        >
          {plan.ctaLabel || uiString(locale, 'choosePlan')}
        </button>
      </div>
    </article>
  );
};

export default CompactPlanCard;
