import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import BillingPeriodProvider from '@/components/sections/PricingSection/BillingPeriodProvider';
import BillingToggle from '@/components/sections/PricingSection/BillingToggle';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import PlanName from '@/components/sections/PricingSection/PlanName';
import Price from '@/components/sections/PricingSection/Price';
import {
  highlightedPlanIndex,
  planFeatureRows,
  planTone,
} from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

/* Up to four plans share one row and its tracks (subgrid) so the parts line up */
const ONE_ROW =
  'lg:auto-cols-fr lg:grid-flow-col lg:grid-rows-[auto_auto_auto_auto_1fr] lg:gap-y-0';
const GRID_BY_COUNT: Record<number, string> = {
  1: `max-w-[400px] sm:max-lg:max-w-[816px] ${ONE_ROW}`,
  2: `max-w-[520px] sm:max-w-[816px] ${ONE_ROW}`,
  3: `max-sm:max-w-[520px] ${ONE_ROW}`,
  4: `max-sm:max-w-[520px] ${ONE_ROW}`,
};
const GRID_WRAP = 'max-sm:max-w-[520px] lg:grid-cols-3';

/** Default variant: a row of white plan cards under a centred head with the billing toggle */
const PlanCards = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  const PlanHeading = itemHeadingLevel(as);
  const count = plans.length;
  const oneRow = count <= 4;
  const highlightedIndex = highlightedPlanIndex(plans);
  const featureRows = planFeatureRows(plans);
  const headingId = `${uid}-pricing`;

  return (
    <section
      id="pricing"
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'pricing')}
    >
      <BillingPeriodProvider className="container-page" locale={locale}>
        <SectionTitle
          id={headingId}
          title={header}
          paragraph={subheader}
          align="center"
          as={as}
          h1Size="page"
        >
          <BillingToggle className="max-md:-mt-1 max-md:h-11" locale={locale} />
        </SectionTitle>

        <div
          className={cn(
            'reveal-stagger mx-auto grid gap-4',
            GRID_BY_COUNT[count] ?? GRID_WRAP,
          )}
        >
          {plans.map((plan, i) => {
            const isHighlighted = i === highlightedIndex;
            const planHeadingId = `${uid}-plan-${i}`;
            const features = featureRows[i];

            return (
              <article
                key={plan.id}
                aria-labelledby={planHeadingId}
                className={cn(
                  'card sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:grid-rows-[auto_auto_1fr] sm:max-lg:items-start sm:max-lg:gap-x-10',
                  oneRow
                    ? 'lg:row-span-5 lg:grid lg:grid-rows-subgrid'
                    : 'lg:flex lg:flex-col',
                  isHighlighted
                    ? 'ring-grad p-[27px] shadow-feature max-md:p-[23px]'
                    : 'p-7 max-md:p-6',
                )}
              >
                <div className="sm:max-lg:col-start-1">
                  <div className="flex items-center gap-2.5">
                    <PlanName
                      headingLevel={PlanHeading}
                      id={planHeadingId}
                      tone={planTone(i, count)}
                    >
                      {plan.tierName}
                    </PlanName>
                    {isHighlighted && plan.highlightLabel && (
                      <span className="badge badge-accent ms-auto h-7 px-3 text-[12.5px]">
                        {plan.highlightLabel}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-body text-ink-2 leading-[1.55] lg:min-h-[4.65em] [&_p+p]:mt-2">
                    <DatoStructuredText data={plan.tierDescription} />
                  </div>
                </div>

                {/* One element, so the subgrid keeps one row for the price */}
                <div className="mt-5 sm:max-lg:col-start-1">
                  <Price
                    monthly={plan.monthlyPrice}
                    yearly={plan.yearlyPrice}
                    locale={locale}
                  />
                  {plan.priceNote && (
                    <p className="mt-2 text-small text-ink-3">
                      {plan.priceNote}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className={cn(
                    'btn mt-5 w-full sm:max-lg:col-start-1',
                    isHighlighted ? 'btn-primary' : 'btn-secondary',
                  )}
                >
                  {plan.ctaLabel || uiString(locale, 'startFreeTrial')}
                </button>

                {features.length > 0 ? (
                  <ul className="mt-5 grid content-start border-line border-t pt-4 sm:max-lg:col-start-2 sm:max-lg:row-span-3 sm:max-lg:row-start-1 sm:max-lg:mt-0 sm:max-lg:border-t-0 sm:max-lg:border-l sm:max-lg:pt-0 sm:max-lg:pl-8">
                    {features.map((feature) => (
                      <PlanFeature
                        key={feature.key}
                        text={feature.text}
                        included={feature.included}
                        locale={locale}
                      />
                    ))}
                  </ul>
                ) : (
                  // Keeps the subgrid's fifth row so the cards stay the same height
                  <div aria-hidden="true" />
                )}
              </article>
            );
          })}
        </div>
      </BillingPeriodProvider>
    </section>
  );
};

export default PlanCards;
