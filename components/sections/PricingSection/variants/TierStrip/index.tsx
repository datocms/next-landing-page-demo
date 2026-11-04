import { useId } from 'react';
import { PricingSectionFragment } from '@/components/sections/PricingSection/fragment';
import Price from '@/components/sections/PricingSection/Price';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import {
  itemHeadingLevel,
  type SectionHeadingLevel,
} from '@/utils/headingLevel';
import TierMeter from './TierMeter';

type Props = {
  fragment: FragmentOf<typeof PricingSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

// One joined strip, kept narrow for a few plans instead of stretching over the page
const STRIP_BY_COUNT: Record<number, string> = {
  1: 'max-w-[360px]',
  2: 'max-w-[720px] sm:grid-cols-2',
  3: 'max-w-[960px] sm:grid-cols-3',
  4: 'max-w-[1200px] sm:grid-cols-2 lg:grid-cols-4',
};
const STRIP_WRAP = 'max-w-[1200px] sm:grid-cols-2 lg:grid-cols-3';

/**
 * `mini_cards`: a single hairline strip of price cells, each with the plan
 * name, a rising tier meter, the monthly price and an ink pill. On phones
 * every tier is one row: name and price left, the button right.
 */
const TierStrip = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    pricingSectionHeader: header,
    pricingSectionSubheader: subheader,
    plans,
  } = readFragment(PricingSectionFragment, fragment);
  const uid = useId();

  const PlanHeading = itemHeadingLevel(as);
  const count = plans.length;
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
          align="center"
          as={as}
          h1Size="page"
        />

        <ul
          className={cn(
            'cells reveal mx-auto',
            STRIP_BY_COUNT[count] ?? STRIP_WRAP,
          )}
        >
          {plans.map((plan, i) => (
            <li
              key={plan.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 p-5 sm:flex sm:min-h-[184px] sm:flex-col sm:items-stretch sm:p-6"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 max-sm:justify-start">
                  <PlanHeading className="min-w-0 text-h4 font-medium text-ink">
                    {plan.tierName}
                  </PlanHeading>
                  <TierMeter rank={i} total={count} className="shrink-0" />
                </div>
                <Price
                  size="responsive"
                  className="mt-2 sm:mt-5"
                  monthly={plan.monthlyPrice}
                  locale={locale}
                />
              </div>
              <div className="sm:mt-auto sm:pt-6">
                <button
                  type="button"
                  className="btn btn-ink btn-sm max-sm:h-11 max-sm:px-5 max-sm:text-ui sm:w-full"
                >
                  {uiString(locale, 'startNow')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TierStrip;
