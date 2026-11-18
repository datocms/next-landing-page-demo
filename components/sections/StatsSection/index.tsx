import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import CountUp from '@/components/motion/CountUp';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { formatFigure } from './figures';
import { StatsSectionFragment } from './fragment';
import StatFigures from './variants/StatFigures';

type Props = {
  fragment: FragmentOf<typeof StatsSectionFragment>;
  locale: string;
};

type Tone = 'accent' | 'pale' | 'tint' | 'ink';

// The tiles take these fills in turn, the same four as the feature mosaic
const TONES: Tone[] = ['accent', 'pale', 'tint', 'ink'];

const FILL: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  ink: 'bg-ink text-surface',
  pale: 'bg-subtle text-fg',
  tint: 'bg-tint text-fg',
};

const LABEL: Record<Tone, string> = {
  accent: 'text-on-accent/90',
  ink: 'text-surface/70',
  pale: 'text-fg-muted',
  tint: 'text-fg-muted',
};

// The icon sits on a small chip: translucent white on the two strong fills, white on the pale ones
const CHIP: Record<Tone, string> = {
  accent: 'bg-[rgb(255_255_255/0.16)] text-on-accent',
  ink: 'bg-[rgb(255_255_255/0.1)] text-surface',
  pale: 'bg-surface text-accent',
  tint: 'bg-surface text-accent',
};

/**
 * `tiles` (the default; `figures` is in variants/): the figures as a row of tiles in four fills (accent, two pale tints, navy):
 * the statistic's icon on a chip, then the number large with its label under
 * it. The strong tiles carry faint rings, the pale ones a small chart. Four in
 * a line from 1024px, two from 640px, one on phones.
 */
const StatsSection = ({ fragment, locale }: Props) => {
  const { statistics, layout } = readFragment(StatsSectionFragment, fragment);
  if (statistics.length === 0) return null;
  if (stripStega(layout ?? '').trim() === 'figures') {
    return <StatFigures fragment={fragment} locale={locale} />;
  }

  return (
    <section className="section">
      <div className="container-page">
        {statistics.length > 0 && (
          <ul
            style={
              { '--cols': Math.min(statistics.length, 4) } as CSSProperties
            }
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          >
            {statistics.map((stat, index) => {
              const tone = TONES[index % TONES.length];
              const strong = tone === 'accent' || tone === 'ink';

              return (
                <li
                  key={stat.id}
                  className={cn(
                    'reveal relative flex min-h-[9.5rem] flex-col justify-between gap-6 overflow-hidden rounded-card p-5 max-lg:last:odd:col-span-2 sm:min-h-[14.5rem] sm:gap-8 sm:p-7',
                    FILL[tone],
                  )}
                >
                  {strong && (
                    <span
                      aria-hidden="true"
                      style={
                        {
                          '--loop-time': `${30 + index * 7}s`,
                          '--loop-scale': 1.07,
                        } as CSSProperties
                      }
                      className="breathe loop pointer-events-none absolute -top-[70px] -right-[70px] size-[130px] rounded-full shadow-[0_0_0_36px_rgb(255_255_255/0.08),0_0_0_76px_rgb(255_255_255/0.05),0_0_0_120px_rgb(255_255_255/0.03)]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="relative flex items-start justify-between gap-4"
                  >
                    {stat.icon?.url ? (
                      <span
                        className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-control sm:size-11',
                          CHIP[tone],
                        )}
                      >
                        {/* The icon is used as a mask, so it takes the chip's colour whatever its own */}
                        <span
                          className="size-5 bg-current"
                          style={{
                            mask: `url("${stat.icon.url}") center / contain no-repeat`,
                            WebkitMask: `url("${stat.icon.url}") center / contain no-repeat`,
                          }}
                        />
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>
                  <div className="relative">
                    <p className="whitespace-nowrap font-semibold text-[1.75rem] tabular-nums sm:text-[clamp(2.5rem,4.1vw,3.5rem)] leading-none tracking-[-0.055em]">
                      <CountUp text={formatFigure(stat.quantity, locale)} />
                    </p>
                    <p
                      className={cn(
                        'mt-2 text-small sm:mt-3 sm:text-body',
                        LABEL[tone],
                      )}
                    >
                      {stat.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
