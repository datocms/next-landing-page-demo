import { stripStega } from '@datocms/content-link';
import { useId } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import PlanDot from '@/components/sections/PricingSection/PlanDot';
import PlanFeature from '@/components/sections/PricingSection/PlanFeature';
import Price, { PriceTag } from '@/components/sections/PricingSection/Price';
import {
  planTone,
  splitFeatures,
} from '@/components/sections/PricingSection/plans';
import { Threads } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import CompactPlanCard from './CompactPlanCard';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  /** h1 when the section opens a page without a hero */
  as?: 'h1' | 'h2';
};

/**
 * `cards_gradient`: the first plan sits in a well crowned by an accent thread
 * ribbon (with a "Best value" chip), and the other plans are compact cards
 * beside it that share its height. No billing toggle: the monthly price leads
 * and the yearly price is a mono line under it. Zero client JavaScript.
 */
const BestValueCards = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  if (!plans?.length) return null;

  const [bestPlan, ...otherPlans] = plans;
  const count = plans.length;
  // Four or more plans: the best plan spans the row and the rest go below in threes
  const wide = count >= 4;
  // Plan names sit one level below the section heading
  const PlanHeading = as === 'h1' ? 'h2' : 'h3';
  const headingId = `${uid}-pricing`;
  const features = splitFeatures(bestPlan.planFeatures);

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'pricing')}
    >
      <div className="container-page">
        <SectionTitle
          id={headingId}
          title={header}
          paragraph={subheader}
          as={as}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <article
            aria-labelledby={`${uid}-plan-0`}
            className={cn(
              'well reveal flex flex-col p-1.5 md:col-span-2 md:p-2',
              count === 1 && 'max-w-[720px] lg:col-span-12',
              count > 1 && !wide && 'lg:col-span-7',
              wide && 'lg:col-span-12',
            )}
          >
            {/* The crown follows the ribbon's proportions (capped on wide wells). The ribbon
                fills it and runs on under the card's top edge, so the card always starts on
                the threads; on a capped crown the slice keeps the threads centred. When the
                compact cards beside it make the well taller, the crown takes that height so
                the card below stays tight */}
            <div
              className={cn(
                'relative aspect-[5/1] max-h-[176px] min-h-[66px] grow md:min-h-[80px]',
                count > 1 && !wide && 'lg:max-h-none',
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
                  <PlanDot tone={planTone(0, count)} />
                  <PlanHeading
                    id={`${uid}-plan-0`}
                    className="font-medium text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em]"
                  >
                    {bestPlan.tierName}
                  </PlanHeading>
                </div>
                <div className="mt-2 max-w-[52ch] text-body text-ink-2 leading-[1.55] [&_p+p]:mt-2">
                  <DatoStructuredText data={bestPlan.tierDescription} />
                </div>
                <div className="mt-auto pt-6">
                  <Price monthly={bestPlan.monthlyPrice} locale={locale} />
                  <PriceTag
                    className="mt-2 block"
                    yearly={bestPlan.yearlyPrice}
                    locale={locale}
                  />
                  <button
                    type="button"
                    className="btn btn-primary mt-6 w-full max-md:h-12"
                  >
                    {uiString(locale, 'choosePlan')}
                  </button>
                </div>
              </div>

              {features.length > 0 && (
                <ul
                  className={cn(
                    'mt-6 grid content-start items-start gap-x-6 border-line border-t pt-5 sm:grid-cols-2',
                    wide &&
                      'lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12',
                  )}
                >
                  {features.map((feature) => (
                    <PlanFeature
                      key={`${bestPlan.id}-${stripStega(feature)}`}
                      text={feature}
                      included
                      locale={locale}
                    />
                  ))}
                </ul>
              )}
            </div>
          </article>

          {otherPlans.length > 0 && (
            <div
              className={cn(
                'reveal-stagger grid gap-4 md:col-span-2 md:grid-cols-2',
                wide
                  ? 'lg:col-span-12 lg:grid-cols-3'
                  : 'lg:col-span-5 lg:auto-rows-fr lg:grid-cols-1',
              )}
            >
              {otherPlans.map((plan, i) => (
                <CompactPlanCard
                  key={plan.id}
                  plan={plan}
                  tone={planTone(i + 1, count)}
                  locale={locale}
                  headingId={`${uid}-plan-${i + 1}`}
                  heading={PlanHeading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestValueCards;
