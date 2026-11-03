import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import BillingScope from '@/components/sections/PricingSection/BillingScope';
import BillingToggle from '@/components/sections/PricingSection/BillingToggle';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanDot from '@/components/sections/PricingSection/PlanDot';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import Price from '@/components/sections/PricingSection/Price';
import {
  featuredPlanIndex,
  planFeatureRows,
  planTone,
} from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/* Up to four plans share one row on lg and its row tracks (subgrid), so
   descriptions, prices, buttons and lists line up; five or more wrap in threes.
   Stacked cards stay at most 520 wide on phones; one or two plans stay narrow. */
const ONE_ROW =
  'lg:auto-cols-fr lg:grid-flow-col lg:grid-rows-[auto_auto_auto_auto_1fr] lg:gap-y-0';
const GRID_BY_COUNT: Record<number, string> = {
  1: `max-w-[400px] sm:max-lg:max-w-[816px] ${ONE_ROW}`,
  2: `max-w-[520px] sm:max-w-[816px] ${ONE_ROW}`,
  3: `max-sm:max-w-[520px] ${ONE_ROW}`,
  4: `max-sm:max-w-[520px] ${ONE_ROW}`,
};
const GRID_WRAP = 'max-sm:max-w-[520px] lg:grid-cols-3';

/**
 * Default variant: a row of white plan cards under a centred head with the
 * billing toggle. The middle plan carries the 2px gradient border. From 640 to
 * 1023 each card is a two-column row (details left, features right).
 */
const PlanCards = ({ fragment, locale, as = 'h2' }: Props) => {
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
  const oneRow = count <= 4;
  const featured = featuredPlanIndex(count);
  const featureRows = planFeatureRows(plans);
  const headingId = `${uid}-pricing`;

  return (
    <section
      id="pricing"
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'pricing')}
    >
      <BillingScope className="container-page" locale={locale}>
        <SectionTitle
          id={headingId}
          title={header}
          paragraph={subheader}
          align="center"
          as={as}
        >
          {/* Phones: a 44px track, 20px under the lead */}
          <BillingToggle className="max-md:-mt-1 max-md:h-11" locale={locale} />
        </SectionTitle>

        <div
          className={cn(
            'reveal-stagger mx-auto grid gap-4',
            GRID_BY_COUNT[count] ?? GRID_WRAP,
          )}
        >
          {plans.map((plan, i) => {
            const isFeatured = i === featured;
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
                  isFeatured
                    ? 'ring-grad p-[27px] shadow-feature max-md:p-[23px]'
                    : 'p-7 max-md:p-6',
                )}
              >
                <div className="sm:max-lg:col-start-1">
                  <div className="flex items-center gap-2.5">
                    <PlanDot tone={planTone(i, count)} />
                    <PlanHeading
                      id={planHeadingId}
                      className="font-medium text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em]"
                    >
                      {plan.tierName}
                    </PlanHeading>
                  </div>
                  <div className="mt-2 text-body text-ink-2 leading-[1.55] lg:min-h-[4.65em] [&_p+p]:mt-2">
                    <DatoStructuredText data={plan.tierDescription} />
                  </div>
                </div>

                <Price
                  className="mt-5 sm:max-lg:col-start-1"
                  monthly={plan.monthlyPrice}
                  yearly={plan.yearlyPrice}
                  locale={locale}
                />

                <button
                  type="button"
                  className={cn(
                    'btn mt-5 w-full sm:max-lg:col-start-1',
                    isFeatured ? 'btn-primary' : 'btn-secondary',
                  )}
                >
                  {uiString(locale, 'startFreeTrial')}
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
      </BillingScope>
    </section>
  );
};

export default PlanCards;
