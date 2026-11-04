import { Check, Minus } from 'lucide-react';
import { useId } from 'react';
import Price from '@/components/sections/PricingSection/Price';
import { highlightedPlanIndex } from '@/components/sections/PricingSection/plans';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { type ComparisonRow, comparisonGroups } from './comparisonGroups';
import { PricingComparisonSectionFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof PricingComparisonSectionFragment>;
  locale: string;
  as?: SectionHeadingLevel;
};

/** Cell padding, shared by every column so the rows line up */
const CELL = 'px-5 md:px-6';

/** A check for a plain yes, a dash when the plan lacks the row, else the CMS value */
const CellValue = ({
  limit,
  locale,
}: {
  limit: ComparisonRow['cells'][number];
  locale: string;
}) => {
  if (!limit) {
    return (
      <span className="inline-grid size-5 place-items-center rounded-full bg-well text-ink-3 ring-1 ring-line ring-inset">
        <Minus aria-hidden="true" className="size-3" strokeWidth={3} />
        <span className="sr-only">{uiString(locale, 'excluded')}</span>
      </span>
    );
  }

  if (!limit.value) {
    return (
      <span className="inline-grid size-5 place-items-center rounded-full bg-accent-wash text-accent-solid">
        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        <span className="sr-only">{uiString(locale, 'included')}</span>
      </span>
    );
  }

  return <span className="font-medium text-ink">{limit.value}</span>;
};

/**
 * The plan-by-plan comparison table of a pricing page: one column per plan
 * (name, monthly price, button) and the plans' limits as rows, grouped by
 * their CMS group (Usage, Security…). The highlighted plan's column is
 * tinted. When it does not fit, the table scrolls sideways with the feature
 * column pinned.
 */
const PricingComparisonSection = ({ fragment, locale, as = 'h2' }: Props) => {
  const {
    comparisonHeader: header,
    comparisonSubheader: subheader,
    plans,
  } = readFragment(PricingComparisonSectionFragment, fragment);
  const uid = useId();

  const groups = comparisonGroups(plans);
  if (!plans.length || !groups.length) return null;

  const highlightedIndex = highlightedPlanIndex(plans);
  const headingId = `${uid}-compare`;
  const tintHighlighted = (column: number) =>
    column === highlightedIndex && 'bg-well';

  return (
    <section
      className="section"
      aria-labelledby={header ? headingId : undefined}
      aria-label={header ? undefined : uiString(locale, 'comparePlans')}
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

        {/* The reveal stays outside the scroll container */}
        <div className="reveal">
          <div className="overflow-x-auto rounded-card border border-line bg-white">
            <table className="w-full min-w-[680px] border-collapse text-start">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={cn(
                      CELL,
                      'sticky start-0 z-10 w-[31%] bg-white py-6 text-start align-bottom',
                    )}
                  >
                    <span className="label">{uiString(locale, 'feature')}</span>
                  </th>
                  {plans.map((plan, i) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={cn(
                        CELL,
                        'py-6 text-start align-top font-normal',
                        tintHighlighted(i),
                      )}
                    >
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-[1.0625rem] text-ink">
                          {plan.tierName}
                        </span>
                        {i === highlightedIndex && plan.highlightLabel && (
                          <span className="badge badge-accent h-6 px-2.5 text-[12px]">
                            {plan.highlightLabel}
                          </span>
                        )}
                      </span>
                      <Price
                        className="mt-3"
                        size="md"
                        monthly={plan.monthlyPrice}
                        locale={locale}
                      />
                      <button
                        type="button"
                        className={cn(
                          'btn btn-sm mt-4 w-full',
                          i === highlightedIndex
                            ? 'btn-primary'
                            : 'btn-secondary',
                        )}
                      >
                        {plan.ctaLabel || uiString(locale, 'startFreeTrial')}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              {groups.map((group) => (
                <tbody key={group.key}>
                  <tr className="border-line border-t">
                    <th
                      scope="rowgroup"
                      className={cn(
                        CELL,
                        'sticky start-0 bg-white pt-7 pb-2.5 text-start',
                      )}
                    >
                      <span className="label">{group.name}</span>
                    </th>
                    {plans.map((plan, i) => (
                      <td
                        key={plan.id}
                        aria-hidden="true"
                        className={tintHighlighted(i) || undefined}
                      />
                    ))}
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.key} className="border-line border-t">
                      <th
                        scope="row"
                        className={cn(
                          CELL,
                          'sticky start-0 bg-white py-3.5 text-start font-normal text-small text-ink-2',
                        )}
                      >
                        {row.label}
                      </th>
                      {row.cells.map((limit, i) => (
                        <td
                          key={plans[i].id}
                          className={cn(
                            CELL,
                            'py-3.5 text-small',
                            tintHighlighted(i),
                          )}
                        >
                          <CellValue limit={limit} locale={locale} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingComparisonSection;
