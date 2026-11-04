import { useId } from 'react';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import { planTone } from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import BestPlanWell, { type BestPlanLayout } from './BestPlanWell';
import CompactPlanCard from './CompactPlanCard';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

const layoutFor = (count: number): BestPlanLayout => {
  if (count === 1) return 'single';
  return count >= 4 ? 'wide' : 'beside';
};

/**
 * `cards_gradient`: the first plan sits in a well crowned by an accent thread
 * ribbon (with a "Best value" chip), and the other plans are compact cards
 * beside it that share its height. No billing toggle: the monthly price leads
 * and the yearly price is a mono line under it.
 */
const BestValueCards = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  const [bestPlan, ...otherPlans] = plans;
  const count = plans.length;
  const layout = layoutFor(count);
  const PlanHeading = itemHeadingLevel(as);
  const headingId = `${uid}-pricing`;

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
          h1Size="page"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <BestPlanWell
            plan={bestPlan}
            tone={planTone(0, count)}
            locale={locale}
            headingId={`${uid}-plan-0`}
            headingLevel={PlanHeading}
            layout={layout}
          />

          {otherPlans.length > 0 && (
            <div
              className={cn(
                'reveal-stagger grid gap-4 md:col-span-2 md:grid-cols-2',
                layout === 'wide'
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
                  headingLevel={PlanHeading}
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
