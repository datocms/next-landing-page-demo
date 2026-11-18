import { stripStega } from '@datocms/content-link';
import type { CSSProperties } from 'react';
import { stegaOnly } from '@/lib/datocms/contentLink';
import {
  type FragmentOf,
  type ResultOf,
  readFragment,
} from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { IntegrationsSectionFragment } from './fragment';
import styles from './integrations.module.css';
import IntegrationGrid from './variants/IntegrationGrid';

type Props = {
  fragment: FragmentOf<typeof IntegrationsSectionFragment>;
};

type Integration = ResultOf<
  typeof IntegrationsSectionFragment
>['integrations'][number];

// A half of a drifting row holds at least this many pills, so it is wider than
// any screen and the loop never shows a gap
const MIN_PER_HALF = 12;
// Seconds for one pill to drift past: the speed stays the same whatever the count
const SECONDS_PER_PILL = 5.5;

/** One integration: its icon on a white disc, tinted with the text colour, and its name */
const Pill = ({ integration }: { integration: Integration }) => {
  const url = integration.icon?.url;
  return (
    <span className="flex h-14 shrink-0 items-center gap-3 rounded-full bg-subtle pr-5 pl-2">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-fg"
      >
        {url && (
          <span
            data-datocms-content-link-source={
              stegaOnly(integration.icon?.alt) || undefined
            }
            className="size-5 bg-current"
            style={{
              mask: `url("${url}") center / contain no-repeat`,
              WebkitMask: `url("${url}") center / contain no-repeat`,
            }}
          />
        )}
      </span>
      <span className="whitespace-nowrap font-medium text-fg text-small">
        {integration.name}
      </span>
    </span>
  );
};

/**
 * `drift` (the default; `grid` is in variants/): the tools the product works with, as pills (icon and name) in two rows that
 * drift slowly sideways in opposite directions, in a seamless loop, fading out
 * at the edges and pausing under the pointer. Each integration is in the real
 * list once; the repeats that fill and loop the rows are aria-hidden. Under
 * reduced motion the rows stand still and wrap, centred.
 */
const IntegrationsSection = ({ fragment }: Props) => {
  const { integrations, layout } = readFragment(
    IntegrationsSectionFragment,
    fragment,
  );
  if (integrations.length === 0) return null;
  if (stripStega(layout ?? '').trim() === 'grid') {
    return <IntegrationGrid fragment={fragment} />;
  }

  // Two rows from six integrations on, the first taking the odd one
  const split =
    integrations.length >= 6
      ? Math.ceil(integrations.length / 2)
      : integrations.length;
  const rows = [integrations.slice(0, split), integrations.slice(split)].filter(
    (row) => row.length > 0,
  );

  return (
    <section className="section">
      <div>
        {rows.length > 0 && (
          <div className={styles.rows}>
            {rows.map((row, rowIndex) => {
              const repeats = Math.max(
                1,
                Math.ceil(MIN_PER_HALF / row.length) - 1,
              );
              const perHalf = row.length * (repeats + 1);
              const fillerItems: { key: string; integration: Integration }[] =
                [];
              for (let round = 1; round <= repeats; round++) {
                for (const integration of row) {
                  fillerItems.push({
                    key: `${integration.id}-${round}`,
                    integration,
                  });
                }
              }
              const filler = fillerItems.map((item) => (
                <Pill key={item.key} integration={item.integration} />
              ));

              return (
                <div
                  key={row[0].id}
                  data-reverse={rowIndex % 2 === 1 ? '' : undefined}
                  className={styles.row}
                >
                  <div
                    className={styles.track}
                    style={
                      {
                        '--duration': `${perHalf * SECONDS_PER_PILL}s`,
                      } as CSSProperties
                    }
                  >
                    <div className={styles.half}>
                      <ul className={styles.list}>
                        {row.map((integration) => (
                          <li key={integration.id} className="flex">
                            <Pill integration={integration} />
                          </li>
                        ))}
                      </ul>
                      <div aria-hidden="true" className={styles.filler}>
                        {filler}
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className={cn(styles.half, styles.copy)}
                    >
                      {row.map((integration) => (
                        <Pill
                          key={`${integration.id}-copy`}
                          integration={integration}
                        />
                      ))}
                      {filler}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default IntegrationsSection;
