import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';
import { TimelineSectionFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof TimelineSectionFragment>;
};

/** Up to this many stops stand in one row from 1024px; more stay a vertical path */
const MAX_IN_ROW = 5;

/**
 * The company's story as a path, oldest stop first. On phones (and for more
 * than five stops) a vertical spine runs down the left with a dot at each stop;
 * from 1024px up to five stops stand in a row on one horizontal line. Each stop
 * shows its period set large and tight, its dot on the line, then a pale tile
 * with the title and the text. The newest stop is where the company stands
 * now: its dot is the accent with a soft halo, its period is set in the accent
 * and its tile takes the stronger tint.
 */
const TimelineSection = ({ fragment }: Props) => {
  const { milestones } = readFragment(TimelineSectionFragment, fragment);
  if (milestones.length === 0) return null;

  const inRow = milestones.length <= MAX_IN_ROW;
  const last = milestones.length - 1;

  return (
    <section className="section">
      <div className="container-page">
        {milestones.length > 0 && (
          <div className={'relative'}>
            {/* The line: a spine through the dots' centres, or from 1024px a
                rule across the row from the first dot onwards */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute top-5 bottom-2 left-[11px] w-0.5',
                inRow &&
                  'lg:top-[calc(5.5rem-1px)] lg:right-0 lg:bottom-auto lg:left-3 lg:h-0.5 lg:w-auto',
              )}
            >
              <span className="block size-full bg-line-strong" />
            </span>
            <ol
              style={{ '--n': milestones.length } as CSSProperties}
              className={cn(
                'relative grid gap-y-10',
                inRow &&
                  'lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-x-5',
              )}
            >
              {milestones.map((milestone, index) => {
                const newest = index === last;

                return (
                  <li
                    key={milestone.id}
                    className={cn(
                      'relative flex flex-col pl-11 sm:pl-14',
                      inRow && 'lg:pl-0',
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-[2.5rem] leading-none tracking-[-0.055em] tabular-nums',
                        inRow && 'lg:min-h-[3.25rem] lg:text-[3.25rem]',
                        newest ? 'text-accent-ink' : 'text-fg',
                      )}
                    >
                      {milestone.period}
                    </p>
                    {/* The stop's dot: beside the period on the spine, on the line in a row */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute top-2 left-0 flex size-6 items-center justify-center',
                        inRow &&
                          'lg:relative lg:top-auto lg:left-0 lg:mt-6 lg:mb-1',
                      )}
                    >
                      <span
                        className={cn(
                          'block rounded-full',
                          newest
                            ? 'size-4 bg-accent shadow-[0_0_0_6px_var(--color-accent-soft)]'
                            : 'size-3.5 border-[3px] border-fg bg-surface',
                        )}
                      />
                    </span>
                    <div
                      className={cn(
                        'mt-5 flex-1 rounded-card p-6',
                        inRow && 'lg:mt-4 lg:px-5 lg:pt-5 lg:pb-6',
                        newest ? 'bg-tint' : 'bg-subtle',
                      )}
                    >
                      <h2 className="text-h3 [hyphens:auto]">
                        {milestone.title}
                      </h2>
                      {hasStructuredText(milestone.description) && (
                        <div className="mt-2 text-fg-muted text-small leading-[1.55] [&_p+p]:mt-2">
                          <DatoStructuredText data={milestone.description} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
