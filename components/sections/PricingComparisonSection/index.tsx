import {
  formatPrice,
  highlightedPlanIndex,
} from '@/components/sections/PricingSection/plans';
import { CheckIcon, DashIcon } from '@/components/ui/icons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import { type ComparisonRow, comparisonGroups } from './comparisonGroups';
import { PricingComparisonSectionFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof PricingComparisonSectionFragment>;
  locale: string;
};

/** Cell padding, shared by every column so the rows line up */
const CELL = 'px-2 sm:px-4 md:px-6';
/** Up to this many plans the table fits a 360px phone; more scroll sideways */
const FIT_MAX = 3;
/** The feature column stays put while the plans scroll sideways */
const STICKY_COLUMN =
  'sticky left-0 z-[1] bg-surface pl-3 hyphens-auto [overflow-wrap:anywhere] sm:pl-4 md:pl-6';

/** An accent check for a plain yes, a dash when the plan lacks the row, else the CMS value */
const CellValue = ({
  limit,
  locale,
}: {
  limit: ComparisonRow['cells'][number];
  locale: string;
}) => {
  if (!limit) {
    return (
      <>
        <DashIcon className="size-4 text-fg-faint" />
        <span className="sr-only">{uiString(locale, 'excluded')}</span>
      </>
    );
  }
  if (!limit.value) {
    return (
      <>
        <CheckIcon className="size-4 text-accent-ink" />
        <span className="sr-only">{uiString(locale, 'included')}</span>
      </>
    );
  }
  return <span>{limit.value}</span>;
};

/**
 * The plan comparison of a pricing page: a real table, one column per plan,
 * the plans' limits as rows under bold group rows, in a 28px hairline card;
 * the highlighted plan's column sits on the pale tint. The feature column
 * is sticky. Up to three plans fit a 360px phone (tighter cells, smaller text);
 * with more, the table scrolls sideways inside its frame.
 * From 1024px the frame no longer scrolls, so the row of plan names can stick
 * under the site header while the visitor reads down.
 */
const PricingComparisonSection = ({ fragment, locale }: Props) => {
  const { plans } = readFragment(PricingComparisonSectionFragment, fragment);

  const groups = comparisonGroups(plans);
  if (!plans.length || !groups.length) return null;
  const fits = plans.length <= FIT_MAX;
  const highlighted = highlightedPlanIndex(plans);
  /** The highlighted plan's column sits on the pale tint, from its header to the last row */
  const columnFill = (i: number) => (i === highlighted ? 'bg-subtle' : '');

  return (
    <section className="section" aria-label={uiString(locale, 'comparePlans')}>
      <div className="container-page">
        <div className="reveal card overflow-x-auto lg:overflow-visible">
          <table
            className={cn(
              'w-full table-fixed border-separate border-spacing-0 text-left text-ui sm:text-small',
              !fits && 'min-w-[34rem]',
            )}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className={cn(
                    CELL,
                    STICKY_COLUMN,
                    fits ? 'w-[28%]' : 'w-36',
                    'rounded-tl-card sm:w-[34%] pt-6 pb-5 text-left align-bottom font-normal lg:top-(--header-h) lg:z-[2]',
                    'shadow-[inset_0_-1px_0_var(--color-line)]',
                  )}
                >
                  <span className="sr-only">{uiString(locale, 'feature')}</span>
                </th>
                {plans.map((plan, i) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={cn(
                      CELL,
                      i === highlighted ? 'bg-subtle' : 'bg-surface',
                      'pt-6 pb-5 text-left align-bottom font-normal lg:sticky lg:top-(--header-h) lg:z-[1]',
                      'shadow-[inset_0_-1px_0_var(--color-line)]',
                      i === plans.length - 1 && 'rounded-tr-card',
                    )}
                  >
                    <span
                      className={cn(
                        'block text-small font-semibold tracking-[-0.02em] sm:text-h3',
                        i === highlighted && 'text-accent-ink',
                      )}
                    >
                      {plan.name}
                    </span>
                    <span className="mt-0.5 block text-fg-muted sm:whitespace-nowrap">
                      {/* On phones the period goes under the price, the same in every column */}
                      <span className="block sm:inline">
                        {formatPrice(plan.monthlyPrice, locale)}
                      </span>{' '}
                      {uiString(locale, 'perMonth')}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {groups.map((group, g) => (
              <tbody key={group.key}>
                <tr>
                  <th
                    scope="rowgroup"
                    // No fill and no wrapping: a long group name runs over the empty cells beside it
                    className={cn(
                      CELL,
                      'sticky left-0 z-[1] whitespace-nowrap pt-6 pb-2.5 pl-3 text-left font-semibold sm:pl-4 md:pl-6',
                      g > 0 && 'border-line border-t',
                    )}
                  >
                    {group.name}
                  </th>
                  {plans.map((plan, i) => (
                    <td
                      key={plan.id}
                      className={cn(
                        columnFill(i),
                        g > 0 && 'border-line border-t',
                      )}
                    />
                  ))}
                </tr>
                {group.rows.map((row, r) => {
                  const isLast =
                    g === groups.length - 1 && r === group.rows.length - 1;
                  return (
                    <tr key={row.key}>
                      <th
                        scope="row"
                        className={cn(
                          CELL,
                          STICKY_COLUMN,
                          'border-line border-t py-3.5 text-left font-normal text-fg-muted',
                          isLast && 'rounded-bl-card',
                        )}
                      >
                        {row.label}
                      </th>
                      {row.cells.map((limit, i) => (
                        <td
                          key={plans[i].id}
                          className={cn(
                            CELL,
                            columnFill(i),
                            'border-line border-t py-3.5 align-middle tabular-nums',
                            isLast &&
                              i === plans.length - 1 &&
                              'rounded-br-card',
                          )}
                        >
                          <span className="flex min-h-[1lh] items-center">
                            <CellValue limit={limit} locale={locale} />
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingComparisonSection;
