import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import BillingScope from '@/components/sections/PricingSection/BillingScope';
import BillingToggle from '@/components/sections/PricingSection/BillingToggle';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import Price from '@/components/sections/PricingSection/Price';
import {
  highlightedPlanIndex,
  planFeatureRows,
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

/**
 * `minimal`: one joined, hairline-divided plan table instead of separate
 * cards. Up to four plans are columns on lg that share row tracks (subgrid);
 * the featured column is filled with the well tint and carries the ink CTA.
 * Below lg (and always for five or more plans) each plan is a row, split into
 * details and features from 640.
 */
const PlanTable = ({ fragment, locale, as = 'h2' }: Props) => {
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
  const asColumns = count <= 4;
  const featured = highlightedPlanIndex(plans);
  const featureRows = planFeatureRows(plans);
  const headingId = `${uid}-pricing`;

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
          gap="lg"
          aside={<BillingToggle className="max-md:h-11" locale={locale} />}
        />

        <div
          className={cn(
            'reveal grid divide-y divide-line overflow-hidden rounded-card border border-line bg-white',
            asColumns &&
              'lg:auto-cols-fr lg:grid-flow-col lg:grid-rows-[auto_auto_auto_1fr] lg:divide-x lg:divide-y-0',
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
                  'p-6 sm:grid sm:grid-cols-2 sm:grid-rows-[auto_auto_1fr] sm:items-start sm:gap-x-10 md:p-7',
                  asColumns &&
                    'lg:row-span-4 lg:grid-cols-1 lg:grid-rows-subgrid lg:items-stretch',
                  isFeatured && 'bg-well',
                )}
              >
                <div className="sm:col-start-1">
                  <PlanHeading id={planHeadingId} className="text-h3 text-ink">
                    {plan.tierName}
                  </PlanHeading>
                  <div
                    className={cn(
                      'mt-1.5 max-w-[34ch] text-body text-ink-2 [&_p+p]:mt-2',
                      asColumns && 'lg:min-h-[4.8em]',
                    )}
                  >
                    <DatoStructuredText data={plan.tierDescription} />
                  </div>
                </div>

                <Price
                  className="mt-5 sm:col-start-1"
                  monthly={plan.monthlyPrice}
                  yearly={plan.yearlyPrice}
                  locale={locale}
                />

                <div className="sm:col-start-1">
                  <button
                    type="button"
                    className={cn(
                      'btn mt-5 w-full',
                      isFeatured ? 'btn-ink' : 'btn-secondary',
                    )}
                  >
                    {plan.ctaLabel || uiString(locale, 'choosePlan')}
                  </button>
                </div>

                {features.length > 0 ? (
                  <ul
                    className={cn(
                      'mt-6 grid content-start sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:mt-0',
                      asColumns &&
                        'lg:col-start-auto lg:row-span-1 lg:row-start-auto lg:mt-6',
                    )}
                  >
                    {features.map((feature) => (
                      <PlanFeature
                        key={feature.key}
                        size="sm"
                        text={feature.text}
                        included={feature.included}
                        locale={locale}
                      />
                    ))}
                  </ul>
                ) : (
                  // Keeps the subgrid's last row so the columns stay the same height
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

export default PlanTable;
