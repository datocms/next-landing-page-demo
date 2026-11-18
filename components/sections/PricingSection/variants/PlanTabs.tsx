import { useId } from 'react';
import Chip from '@/components/ui/Chip';
import { uiString } from '@/lib/i18n/uiStrings';
import type { Plan } from '../fragment';
import { FeatureList, PlanButton, PlanDescription, Price } from '../PlanParts';
import { formatPrice, planFeatureRows } from '../plans';
import TabList from '../TabList';

type Props = {
  plans: Plan[];
  highlighted: number;
  locale: string;
};

/** What a plan's tab tile shows: the name, then the price for the billing period picked */
const TabFace = ({ plan, locale }: { plan: Plan; locale: string }) => (
  <>
    <span className="font-semibold text-[1.0625rem] leading-tight tracking-[-0.01em]">
      {plan.name}
    </span>
    <span className="text-[0.9375rem] tabular-nums opacity-75">
      <span
        className={
          plan.yearlyPrice != null
            ? 'group-data-[period=yearly]/billing:hidden'
            : undefined
        }
      >
        {formatPrice(plan.monthlyPrice, locale)} {uiString(locale, 'perMonth')}
      </span>
      {plan.yearlyPrice != null && (
        <span className="hidden group-data-[period=yearly]/billing:inline">
          {formatPrice(plan.yearlyPrice, locale)} {uiString(locale, 'perYear')}
        </span>
      )}
    </span>
  </>
);

/**
 * `tabs` (the mosaic page's look): the plans as a row of tiles on the mosaic
 * hero's 12px gap, each with its name and price; the picked one turns navy
 * and its panel shows in the navy tile under the row, an accent quarter
 * circle growing out of its corner. In the panel: the name, description,
 * price and button on the left, the features on the right in two columns
 * (included first, the dashed ones last). Opens on the highlighted plan (the
 * first without one); every panel is in the HTML.
 */
const PlanTabs = ({ plans, highlighted, locale }: Props) => {
  const uid = useId();
  const featureRows = planFeatureRows(plans);

  return (
    <div className="reveal">
      <TabList
        label={uiString(locale, 'plans')}
        idPrefix={uid}
        initial={Math.max(0, highlighted)}
        tabs={plans.map((plan) => (
          <TabFace key={plan.id} plan={plan} locale={locale} />
        ))}
        panels={plans.map((plan, i) => (
          <div
            key={plan.id}
            className="grid gap-x-12 gap-y-8 p-6 pb-28 sm:p-10 sm:pb-32 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:p-14"
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="text-h3">{plan.name}</h2>
                {i === highlighted && plan.highlightLabel && (
                  <Chip tone="inverse">{plan.highlightLabel}</Chip>
                )}
              </div>
              <PlanDescription
                plan={plan}
                tone="accent"
                className="mt-2 max-w-[36ch] text-small"
              />
              <Price
                className="mt-6"
                monthly={plan.monthlyPrice}
                yearly={plan.yearlyPrice}
                locale={locale}
                tone="accent"
              />
              {plan.priceNote && (
                <p className="mt-2 text-[0.875rem] text-surface/70">
                  {plan.priceNote}
                </p>
              )}
              <PlanButton
                plan={plan}
                primary
                variant="light"
                locale={locale}
                size="lg"
                className="mt-7 w-full sm:w-auto sm:min-w-56"
              />
            </div>

            <FeatureList
              rows={featureRows[i]}
              locale={locale}
              tone="accent"
              columns
              className="text-small sm:columns-2 md:pt-1"
            />
          </div>
        ))}
      />
    </div>
  );
};

export default PlanTabs;
