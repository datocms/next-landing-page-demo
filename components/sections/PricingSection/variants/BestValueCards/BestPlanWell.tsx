import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import type { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import PlanName from '@/components/sections/PricingSection/PlanName';
import Price, { PriceTag } from '@/components/sections/PricingSection/Price';
import { ownFeatureRows } from '@/components/sections/PricingSection/plans';
import { Threads } from '@/components/ui/Ornaments';
import type { ResultOf } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import type { Tone } from '@/utils/tones';

type Plan = ResultOf<typeof PricingSectionFragment>['plans'][number];

/** single: the only plan · beside: compact cards share its row · wide: it spans the row, the others go below */
export type BestPlanLayout = 'single' | 'beside' | 'wide';

type Props = {
  plan: Plan;
  tone: Tone;
  locale: string;
  headingId: string;
  headingLevel: ItemHeadingLevel;
  layout: BestPlanLayout;
};

const WELL_SPAN: Record<BestPlanLayout, string> = {
  single: 'max-w-[720px] lg:col-span-12',
  beside: 'lg:col-span-7',
  wide: 'lg:col-span-12',
};

/** The first plan in a well crowned by an accent thread ribbon and a "Best value" chip */
const BestPlanWell = ({
  plan,
  tone,
  locale,
  headingId,
  headingLevel,
  layout,
}: Props) => {
  const features = ownFeatureRows(plan);
  const wide = layout === 'wide';

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'well reveal flex flex-col p-1.5 md:col-span-2 md:p-2',
        WELL_SPAN[layout],
      )}
    >
      {/* The ribbon runs under the card's top edge, so the card always starts on the threads */}
      <div
        className={cn(
          'relative aspect-[5/1] max-h-[176px] min-h-[66px] grow md:min-h-[80px]',
          layout === 'beside' && 'lg:max-h-none',
        )}
      >
        <Threads
          shape="ribbon"
          aspect="xMidYMid slice"
          className="-inset-x-1.5 -top-1.5 bottom-auto h-[calc(136%+0.375rem)] w-[calc(100%+0.75rem)] md:-inset-x-2 md:-top-2 md:h-[calc(136%+0.5rem)] md:w-[calc(100%+1rem)]"
        />
        <span className="float absolute top-2.5 left-2.5 inline-flex h-7 items-center gap-1.5 rounded-pill px-3 font-medium text-[0.78125rem] text-accent-text md:top-3 md:left-3 md:h-8">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-accent-solid"
          />
          {uiString(locale, 'bestValue')}
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col rounded-[14px] border border-line bg-white p-6 shadow-card md:rounded-[16px] md:p-8',
          wide && 'lg:grid lg:grid-cols-2 lg:gap-x-12',
        )}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2.5">
            <PlanName headingLevel={headingLevel} id={headingId} tone={tone}>
              {plan.tierName}
            </PlanName>
          </div>
          <div className="mt-2 max-w-[52ch] text-body text-ink-2 leading-[1.55] [&_p+p]:mt-2">
            <DatoStructuredText data={plan.tierDescription} />
          </div>
          <div className="mt-auto pt-6">
            <Price monthly={plan.monthlyPrice} locale={locale} />
            <PriceTag
              className="mt-2 block"
              yearly={plan.yearlyPrice}
              locale={locale}
            />
            <button
              type="button"
              className="btn btn-primary mt-6 w-full max-md:h-12"
            >
              {plan.ctaLabel || uiString(locale, 'choosePlan')}
            </button>
          </div>
        </div>

        {features.length > 0 && (
          <ul
            className={cn(
              'mt-6 grid content-start items-start gap-x-6 border-line border-t pt-5 sm:grid-cols-2',
              wide && 'lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12',
            )}
          >
            {features.map((feature) => (
              <PlanFeature
                key={feature.key}
                text={feature.text}
                included={feature.included}
                locale={locale}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

export default BestPlanWell;
