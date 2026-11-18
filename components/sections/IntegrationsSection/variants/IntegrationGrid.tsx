import type { CSSProperties } from 'react';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { IntegrationsSectionFragment } from '../fragment';

type Props = {
  fragment: FragmentOf<typeof IntegrationsSectionFragment>;
};

// The tiles are pale; two of them take the mosaic hero's strong fills, the
// accent and navy, set apart so they never touch
const fill = (index: number) =>
  index === 2
    ? 'bg-accent text-on-accent'
    : index === 6
      ? 'bg-ink text-surface'
      : 'bg-subtle text-fg';

/**
 * `grid` (the mosaic page's look): the tools as tiles on the mosaic hero's
 * 12px gap, each with its icon in the top corner and its name at the bottom.
 * The tiles are pale, but for one in the accent and one in navy, like the
 * hero's flat shapes. Five across from 1024px, three from 640px, two on phones.
 */
const IntegrationGrid = ({ fragment }: Props) => {
  const { integrations } = readFragment(IntegrationsSectionFragment, fragment);

  return (
    <section className="section">
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
          {integrations.map((integration, index) => {
            const url = integration.icon?.url;
            return (
              <li
                key={integration.id}
                style={
                  { '--reveal-delay': `${(index % 5) * 60}ms` } as CSSProperties
                }
                className={cn(
                  'reveal flex aspect-[5/4] flex-col justify-between rounded-card p-5 sm:p-6',
                  fill(index),
                )}
              >
                <span aria-hidden="true" className="block size-8">
                  {url && (
                    <span
                      className="block size-full bg-current"
                      style={{
                        mask: `url("${url}") left top / contain no-repeat`,
                        WebkitMask: `url("${url}") left top / contain no-repeat`,
                      }}
                    />
                  )}
                </span>
                <span className="font-semibold text-[1.0625rem] leading-tight tracking-[-0.01em]">
                  {integration.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default IntegrationGrid;
