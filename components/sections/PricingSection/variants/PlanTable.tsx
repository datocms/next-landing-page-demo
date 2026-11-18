import { type CSSProperties, useId } from 'react';
import Chip from '@/components/ui/Chip';
import { CheckIcon, DashIcon } from '@/components/ui/icons';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { Plan } from '../fragment';
import {
  FeatureList,
  PlanButton,
  PlanDescription,
  type PlanTone,
  Price,
} from '../PlanParts';
import { ownFeatureRows, planFeatureRows } from '../plans';

type Props = {
  plans: Plan[];
  highlighted: number;
  locale: string;
};

/** A plan's name, badge, price and note, centred under the top of its arch */
const PlanHead = ({
  plan,
  isHighlighted,
  headingId,
  index,
  locale,
}: {
  plan: Plan;
  isHighlighted: boolean;
  headingId?: string;
  index: number;
  locale: string;
}) => {
  const tone: PlanTone = isHighlighted ? 'accent' : 'default';
  return (
    <div className="flex flex-col items-center text-center">
      <h2 id={headingId} className="text-h3">
        {plan.name}
      </h2>
      {isHighlighted && plan.highlightLabel && (
        <Chip tone="inverse" className="mt-2">
          {plan.highlightLabel}
        </Chip>
      )}
      <div style={{ '--plan-i': index } as CSSProperties} className="mt-4">
        <Price
          monthly={plan.monthlyPrice}
          yearly={plan.yearlyPrice}
          locale={locale}
          tone={tone}
          size="md"
          className="[&>span]:justify-center"
        />
        {plan.priceNote && (
          <p
            className={cn(
              'mt-2 text-[0.875rem]',
              isHighlighted ? 'text-on-accent/80' : 'text-fg-muted',
            )}
          >
            {plan.priceNote}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * `table` (the statement page's look): the plans compared side by side, each
 * plan a column whose top is an arch, like the arches of the statement hero.
 * The highlighted plan's column is the deep accent with white text and rises
 * above the others; the rest are pale. Under the arches every feature is a
 * row: its name on the left, a check or a dash in each plan's column. The
 * buttons close the columns. Below 1024px each plan is an arch-topped card
 * of its own with only the features it includes. When the plans' features do
 * not build on each other, the cards show at every width.
 */
const PlanTable = ({ plans, highlighted, locale }: Props) => {
  const uid = useId();
  const rowsByPlan = planFeatureRows(plans);
  // The rows line up only when every plan lists the same features in the same order
  const aligned =
    plans.length > 1 &&
    rowsByPlan.every((rows) => rows.length === rowsByPlan[0].length);
  const featureNames = aligned
    ? rowsByPlan[highlighted >= 0 ? highlighted : plans.length - 1]
    : [];

  const cards = (
    <ul
      className={cn(
        'grid gap-4 md:grid-cols-2',
        aligned && 'lg:hidden',
        !aligned && 'lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]',
      )}
    >
      {plans.map((plan, i) => {
        const isHighlighted = i === highlighted;
        return (
          <li
            key={plan.id}
            className={cn(
              'reveal flex flex-col rounded-t-full rounded-b-card px-6 pt-20 pb-7 sm:px-8',
              isHighlighted
                ? 'on-ink bg-(--accent-deep) text-on-accent'
                : 'bg-subtle',
            )}
          >
            <PlanHead
              plan={plan}
              isHighlighted={isHighlighted}
              headingId={`${uid}-card-${i}`}
              index={i}
              locale={locale}
            />
            <PlanDescription
              plan={plan}
              tone={isHighlighted ? 'accent' : 'default'}
              className="mx-auto mt-4 max-w-[30ch] text-balance text-center text-small"
            />
            <FeatureList
              rows={ownFeatureRows(plan)}
              locale={locale}
              tone={isHighlighted ? 'accent' : 'default'}
              className="mt-7 flex-1 text-small"
            />
            <PlanButton
              plan={plan}
              primary={isHighlighted}
              variant={isHighlighted ? 'light' : 'secondary'}
              locale={locale}
              size="lg"
              className="mt-8 w-full"
            />
          </li>
        );
      })}
    </ul>
  );

  if (!aligned) return cards;

  /** A column's fill: pale, or the deep accent for the highlighted plan */
  const fill = (i: number) =>
    i === highlighted
      ? 'on-ink bg-(--accent-deep) text-on-accent'
      : 'bg-subtle';

  return (
    <>
      {cards}
      {/* A real table laid out as a grid: the rows and groups step aside
          (display: contents), so each cell is a grid item and a column's cells
          stack into one fill, arched at the top */}
      <table
        style={{
          gridTemplateColumns: `minmax(0,1.15fr) repeat(${plans.length}, minmax(0,1fr))`,
        }}
        className="reveal grid border-separate gap-x-4 max-lg:hidden xl:gap-x-5"
      >
        <caption className="sr-only">{uiString(locale, 'plans')}</caption>
        <thead className="contents">
          <tr className="contents">
            <td />
            {plans.map((plan, i) => (
              <th
                key={plan.id}
                scope="col"
                className={cn(
                  // The highlighted arch rises 2.5rem above the others
                  'rounded-t-full px-5 pt-24 pb-8 font-normal',
                  i !== highlighted && 'mt-10',
                  fill(i),
                )}
              >
                <PlanHead
                  plan={plan}
                  isHighlighted={i === highlighted}
                  index={i}
                  locale={locale}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="contents">
          {featureNames.map((feature, r) => (
            <tr key={feature.key} className="contents">
              <th
                scope="row"
                className="flex items-center border-line border-t py-3.5 text-left font-medium text-[0.9375rem]"
              >
                {feature.text}
              </th>
              {plans.map((plan, i) => {
                const included = rowsByPlan[i][r].included;
                const onAccent = i === highlighted;
                return (
                  <td
                    key={plan.id}
                    className={cn('grid place-items-center py-3.5', fill(i))}
                  >
                    {included ? (
                      <CheckIcon
                        aria-hidden="true"
                        className={cn(
                          'size-[18px]',
                          onAccent ? 'text-on-accent' : 'text-accent-ink',
                        )}
                      />
                    ) : (
                      <DashIcon
                        aria-hidden="true"
                        className={cn(
                          'size-[18px]',
                          onAccent ? 'text-on-accent/50' : 'text-fg-faint',
                        )}
                      />
                    )}
                    <span className="sr-only">
                      {uiString(locale, included ? 'included' : 'excluded')}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot className="contents">
          <tr className="contents">
            <td className="border-line border-t" />
            {plans.map((plan, i) => (
              <td
                key={plan.id}
                className={cn('rounded-b-card px-5 pt-6 pb-6', fill(i))}
              >
                <PlanButton
                  plan={plan}
                  primary={i === highlighted}
                  variant={i === highlighted ? 'light' : 'secondary'}
                  locale={locale}
                  className="w-full"
                />
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default PlanTable;
