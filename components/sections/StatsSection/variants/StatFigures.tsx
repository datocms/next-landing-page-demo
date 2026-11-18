import type { CSSProperties } from 'react';
import CountUp from '@/components/motion/CountUp';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { formatFigure } from '../figures';
import { StatsSectionFragment } from '../fragment';

type Props = {
  fragment: FragmentOf<typeof StatsSectionFragment>;
  locale: string;
};

/**
 * `figures` (the statement page's look): each figure stands inside a thin
 * arch outline, like the faint arches behind the statement hero, all of them
 * on one hairline. Inside, centred, the icon and the label, then the number
 * large in the accent; the digits roll up as the row comes into view. Four
 * across from 1024px, two below.
 */
const StatFigures = ({ fragment, locale }: Props) => {
  const { statistics } = readFragment(StatsSectionFragment, fragment);

  return (
    <section className="section">
      <div className="container-page">
        <ul
          style={{ '--cols': Math.min(statistics.length, 4) } as CSSProperties}
          className="grid grid-cols-2 items-end gap-x-3 gap-y-10 border-line border-b sm:gap-x-5 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-x-7"
        >
          {statistics.map((stat, index) => (
            <li
              key={stat.id}
              style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
              className="reveal flex aspect-[4/5] flex-col items-center justify-end rounded-t-full border border-[color:var(--accent-line)] border-b-0 px-3 pb-7 text-center sm:pb-9 lg:aspect-square"
            >
              <p className="flex items-center gap-2 text-fg-muted text-small">
                {stat.icon?.url && (
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 bg-accent-ink"
                    style={{
                      mask: `url("${stat.icon.url}") center / contain no-repeat`,
                      WebkitMask: `url("${stat.icon.url}") center / contain no-repeat`,
                    }}
                  />
                )}
                {stat.label}
              </p>
              <p className="mt-3 whitespace-nowrap font-semibold text-[2rem] text-accent-ink tabular-nums leading-none tracking-[-0.06em] sm:text-[clamp(2.75rem,4.4vw,4rem)]">
                <CountUp text={formatFigure(stat.quantity, locale)} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StatFigures;
