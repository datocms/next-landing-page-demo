import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import BillingScope from '@/components/sections/PricingSection/BillingScope';
import BillingToggle from '@/components/sections/PricingSection/BillingToggle';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanDot from '@/components/sections/PricingSection/PlanDot';
import Price, { PriceTag } from '@/components/sections/PricingSection/Price';
import {
  planFeatureRows,
  planTone,
} from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import CoverageRing from './CoverageRing';
import FeaturePill from './FeaturePill';
import PlanSwitcher from './PlanSwitcher';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * `feature_list`: a plan switcher (a pill radiogroup with live prices, beside
 * the billing toggle) above one panel for the chosen plan. The panel shows the
 * plan's details on the left and, on the right, a coverage ring over a cloud of
 * feature pills (dashed when the plan lacks a feature another plan has).
 */
const FeatureListSelector = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  if (!plans?.length) return null;

  // Plan names sit one level below the section heading
  const PlanHeading = as === 'h1' ? 'h2' : 'h3';
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

  const panels = plans.map((plan, i) => {
    const features = featureRows[i];
    const includedCount = features.filter((feature) => feature.included).length;
    const planHeadingId = `${uid}-plan-${i}`;

    return (
      <article
        key={plan.id}
        aria-labelledby={planHeadingId}
        className="card grid gap-8 p-6 md:grid-cols-12 md:gap-6 md:p-8"
      >
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <PlanDot tone={planTone(i, count)} />
            <PlanHeading
              id={planHeadingId}
              className="font-medium text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em]"
            >
              {plan.tierName}
            </PlanHeading>
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
  });

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'pricing')}
    >
      <BillingScope className="container-page" locale={locale}>
        <SectionTitle
          id={headingId}
          title={header}
          paragraph={subheader}
          as={as}
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
      </BillingScope>
    </section>
  );
};

export default FeatureListSelector;
