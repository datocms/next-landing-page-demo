import { type CSSProperties, useId } from 'react';
import { Squiggle } from '@/components/ui/Ornaments';
import SectionTitle from '@/components/ui/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import type { SectionHeadingLevel } from '@/utils/headingLevel';
import { toneRamp } from '@/utils/tones';
import { formatCompactNumber } from './formatCompactNumber';
import { StatsSectionFragment } from './fragment';
import MaskIcon from './MaskIcon';

type Props = {
  fragment: FragmentOf<typeof StatsSectionFragment>;
  as?: SectionHeadingLevel;
};

/**
 * Columns from 768 up: one row for up to four figures. Past that, three or
 * four, whichever fills the last row best; the last tile then stretches over
 * any cells still empty.
 */
function columnsFor(count: number) {
  if (count <= 4) return count;
  const lastRow = (columns: number) => count % columns || columns;
  return lastRow(4) >= lastRow(3) ? 4 : 3;
}

/**
 * Tone tiles: one card per figure, its numeral in a contrast-clamped tone
 * gradient that deepens from left to right (tones 1 → 4), with the CMS icon in a
 * tone chip (or a squiggle) in the corner.
 */
const StatsSection = ({ fragment, as = 'h2' }: Props) => {
  const { title, subtitle, statistic } = readFragment(
    StatsSectionFragment,
    fragment,
  );
  const headingId = `stats-${useId()}`;
  const count = statistic.length;
  const columns = columnsFor(count);
  const lastSpan = columns - (count % columns || columns) + 1;

  return (
    <section
      className="section"
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="container-page">
        <SectionTitle
          as={as}
          id={headingId}
          title={title}
          paragraph={subtitle}
        />
        {count > 0 && (
          <dl
            className="reveal-stagger grid grid-cols-2 gap-3 md:grid-cols-[repeat(var(--stat-columns),minmax(0,1fr))] md:gap-4"
            style={{ '--stat-columns': columns } as CSSProperties}
          >
            {statistic.map((stat, index) => {
              const isLast = index === count - 1;
              return (
                <div
                  key={stat.id}
                  className={cn(
                    // A minimum height, so long labels grow the tile instead of overflowing it
                    'card relative flex min-h-[120px] flex-col-reverse justify-start p-[18px] md:min-h-[148px] lg:p-6',
                    // On phones (two columns) an odd last tile spans the row
                    isLast && count % 2 === 1 && 'col-span-2',
                    isLast && 'md:col-span-(--last-stat-span)',
                    toneRamp(index % columns, columns, 1, 4),
                  )}
                  style={
                    isLast
                      ? ({ '--last-stat-span': lastSpan } as CSSProperties)
                      : undefined
                  }
                >
                  <dt className="mt-2 text-meta text-ink-2 md:mt-2.5 md:text-small">
                    {stat.label}
                  </dt>
                  {/* A dl group may only hold dt and dd, so the ornament rides in the dd */}
                  <dd>
                    {/* The end padding keeps a wide numeral clear of the corner ornament; narrow tiles scale it down */}
                    <span className="num block pe-9 text-stat text-tone-grad max-md:text-[clamp(26px,8vw,32px)] md:max-lg:text-[clamp(32px,4.4vw,44px)] lg:pe-11">
                      {formatCompactNumber(stat.quantity)}
                    </span>
                    {stat.icon?.url ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-[18px] end-[18px] grid size-7 place-items-center rounded-full bg-tone-wash lg:top-6 lg:end-6 lg:size-8"
                      >
                        <MaskIcon
                          url={stat.icon.url}
                          className="size-3.5 bg-tone lg:size-4"
                        />
                      </span>
                    ) : (
                      <Squiggle
                        variant="tone"
                        className="absolute top-[18px] end-[18px] h-[13px] w-8 lg:top-6 lg:end-6 lg:h-4 lg:w-10"
                      />
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
