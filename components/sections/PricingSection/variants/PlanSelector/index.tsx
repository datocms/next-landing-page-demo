import { useId } from 'react';
import BillingPeriodProvider from '@/components/sections/PricingSection/BillingPeriodProvider';
import BillingToggle from '@/components/sections/PricingSection/BillingToggle';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import { PriceTag } from '@/components/sections/PricingSection/Price';
import {
  planFeatureRows,
  planTone,
} from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import PlanPanel from './PlanPanel';
import PlanSwitcher from './PlanSwitcher';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

/**
 * `feature_list`: a plan switcher (a pill radiogroup with live prices, beside
 * the billing toggle) above one panel for the chosen plan.
 */
const PlanSelector = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  const PlanHeading = itemHeadingLevel(as);
  const count = plans.length;
  const featureRows = planFeatureRows(plans);
  const headingId = `${uid}-pricing`;
  // The second plan starts selected (the only one when there is just one)
  const defaultPlanId = (plans[1] ?? plans[0]).id;

  const options = plans.map((plan, i) => ({
    id: plan.id,
    name: plan.tierName,
    tone: planTone(i, count),
    price: (
      <PriceTag
        monthly={plan.monthlyPrice}
        yearly={plan.yearlyPrice}
        locale={locale}
      />
    ),
  }));

  const panels = plans.map((plan, i) => (
    <PlanPanel
      key={plan.id}
      plan={plan}
      features={featureRows[i]}
      tone={planTone(i, count)}
      locale={locale}
      headingId={`${uid}-plan-${i}`}
      headingLevel={PlanHeading}
    />
  ));

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'pricing')}
    >
      <BillingPeriodProvider className="container-page" locale={locale}>
        <SectionTitle
          id={headingId}
          title={header}
          paragraph={subheader}
          as={as}
          h1Size="page"
        />
        <PlanSwitcher
          options={options}
          panels={panels}
          defaultId={defaultPlanId}
          toggle={
            <BillingToggle
              className="max-md:h-11 max-sm:w-full"
              locale={locale}
            />
          }
          locale={locale}
        />
      </BillingPeriodProvider>
    </section>
  );
};

export default PlanSelector;
