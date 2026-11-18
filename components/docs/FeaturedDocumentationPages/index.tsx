import type { CSSProperties } from 'react';
import AppLink from '@/components/ui/AppLink';
import { ArrowRightIcon } from '@/components/ui/icons';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsPageUrl } from '@/utils/routes';
import { FeaturedDocumentationPagesFragment } from './fragment';

type Props = {
  fragment: FragmentOf<typeof FeaturedDocumentationPagesFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  className?: string;
};

type Tone = 'accent' | 'ink' | 'pale' | 'tint';

// The tiles repeat this pattern of widths (out of 6 columns) and fills every six,
// the same four fills as the site's feature mosaic
const PATTERN: [span: string, tone: Tone][] = [
  ['md:col-span-4', 'accent'],
  ['md:col-span-2', 'pale'],
  ['md:col-span-2', 'tint'],
  ['md:col-span-4', 'ink'],
  ['md:col-span-3', 'pale'],
  ['md:col-span-3', 'tint'],
];

const FILL: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  ink: 'bg-ink text-surface on-ink',
  pale: 'bg-subtle text-fg',
  tint: 'bg-tint text-fg',
};

const MUTED: Record<Tone, string> = {
  accent: 'text-on-accent/85',
  ink: 'text-surface/70',
  pale: 'text-fg-muted',
  tint: 'text-fg-muted',
};

// The arrow's disc: translucent white on the strong fills, white on the pale ones
const DISC: Record<Tone, string> = {
  accent: 'bg-[rgb(255_255_255/0.16)] text-on-accent',
  ink: 'bg-[rgb(255_255_255/0.1)] text-surface',
  pale: 'bg-surface text-accent-ink',
  tint: 'bg-surface text-accent-ink',
};

/**
 * The docs home's featured pages as a mosaic of linked tiles in the site's four
 * fills (accent, pale, tint, navy): the section a page belongs to as a small
 * label, an arrow on a disc, then the title large and its one-line description.
 * Wide and narrow tiles alternate from 768px (one column below). The strong
 * tiles carry the site's faint corner rings. Under the pointer a tile lifts 2px and its arrow slides on.
 */
const FeaturedDocumentationPages = ({
  fragment,
  globalPageProps,
  className,
}: Props) => {
  const { featuredPages } = readFragment(
    FeaturedDocumentationPagesFragment,
    fragment,
  );

  if (!featuredPages.length) return null;

  return (
    <section aria-labelledby="featured-docs-title" className={className}>
      <h2
        id="featured-docs-title"
        className="font-semibold text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.1] tracking-[-0.04em]"
      >
        {uiString(globalPageProps.params.locale, 'featuredPages')}
      </h2>
      <ul className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-6">
        {featuredPages.map((page, index) => {
          const [span, tone] = PATTERN[index % PATTERN.length];
          const strong = tone === 'accent' || tone === 'ink';
          const wide = span !== 'md:col-span-2';

          return (
            <li key={page.id} className={span}>
              <AppLink
                href={docsPageUrl(globalPageProps, page.slug)}
                className={cn(
                  'group relative flex h-full min-h-[9.5rem] flex-col justify-between gap-6 sm:gap-8 overflow-hidden rounded-card p-6 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:hover:-translate-y-0.5 sm:min-h-[13.5rem] sm:p-7',
                  FILL[tone],
                )}
              >
                {strong && (
                  <span
                    aria-hidden="true"
                    style={
                      {
                        '--loop-time': `${32 + (index % 3) * 7}s`,
                        '--loop-scale': 1.07,
                      } as CSSProperties
                    }
                    className="breathe loop pointer-events-none absolute -top-[72px] -right-[72px] size-[140px] rounded-full shadow-[0_0_0_40px_rgb(255_255_255/0.08),0_0_0_84px_rgb(255_255_255/0.05),0_0_0_132px_rgb(255_255_255/0.03)]"
                  />
                )}

                <span className="relative flex items-start justify-between gap-4">
                  {page.parent?.title ? (
                    <span className={cn('text-ui font-medium', MUTED[tone])}>
                      {page.parent.title}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-full',
                      DISC[tone],
                    )}
                  >
                    <ArrowRightIcon className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-0.5" />
                  </span>
                </span>

                <span className="relative block">
                  <span
                    className={cn(
                      'block text-balance hyphens-auto font-semibold leading-[1.12] tracking-[-0.035em]',
                      wide
                        ? 'text-[clamp(1.375rem,2.1vw,1.75rem)]'
                        : 'text-[1.3125rem]',
                    )}
                  >
                    <span className="title-underline">{page.title}</span>
                  </span>
                  {page.subtitle && (
                    <span
                      className={cn(
                        'mt-2 block max-w-[34ch] text-small',
                        MUTED[tone],
                      )}
                    >
                      {page.subtitle}
                    </span>
                  )}
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FeaturedDocumentationPages;
