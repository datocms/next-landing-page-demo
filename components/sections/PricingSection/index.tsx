import { stripStega } from '@datocms/content-link';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { BillingScope, BillingToggle } from './Billing';
import { PricingSectionFragment } from './fragment';
import { highlightedPlanIndex } from './plans';
import PlanCards from './variants/PlanCards';
import PlanTable from './variants/PlanTable';
import PlanTabs from './variants/PlanTabs';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
};

export type PricingLayout = 'cards' | 'table' | 'tabs';

/** From this many plans, columns get too narrow: `cards` and `tabs` become `table` */
const COLUMNS_MAX = 4;

/** The layout a pricing block renders: its "Layout" value, `cards` for anything unknown */
function pricingLayout(
  value: string | null | undefined,
  count: number,
): PricingLayout {
  const layout = stripStega(value ?? '').trim();
  if (count > COLUMNS_MAX || layout === 'table') return 'table';
  if (layout === 'tabs') return 'tabs';
  return 'cards';
}

/**
 * The pricing block: the monthly/yearly control centred above the plans (when
 * any plan has a yearly price), then the plans in the layout picked in "Layout". Nothing
 * without plans.
 */
const PricingSection = ({ fragment, locale }: Props) => {
  const { layout: layoutValue, plans } = readFragment(
    PricingSectionFragment,
    fragment,
  );
  if (plans.length === 0) return null;

  const layout = pricingLayout(layoutValue, plans.length);
  const highlighted = highlightedPlanIndex(plans);
  const hasYearly = plans.some((plan) => plan.yearlyPrice != null);

  return (
    <section className="section" aria-label={uiString(locale, 'pricing')}>
      <BillingScope locale={locale} className="container-page">
        {hasYearly && (
          <div
            className={cn(
              'mb-10 flex lg:mb-14',
              // The mosaic page's tabs line up on the left, like its hero
              layout === 'tabs' ? 'justify-start' : 'justify-center',
            )}
          >
            <BillingToggle locale={locale} />
          </div>
        )}

        {layout === 'table' && (
          <PlanTable plans={plans} highlighted={highlighted} locale={locale} />
        )}
        {layout === 'tabs' && (
          <PlanTabs plans={plans} highlighted={highlighted} locale={locale} />
        )}
        {layout === 'cards' && (
          <PlanCards plans={plans} highlighted={highlighted} locale={locale} />
        )}
      </BillingScope>
    </section>
  );
};

export default PricingSection;
