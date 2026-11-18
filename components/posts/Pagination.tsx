import AppLink from '@/components/ui/AppLink';
import Button from '@/components/ui/Button';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postsPageUrl } from '@/utils/routes';
import { postsPageCount } from './postsPagination';

type Props = {
  /** The current page, from 1 */
  page: number;
  postCount: number;
  globalPageProps: ResolvedGlobalPageProps;
  /** Placement only */
  className?: string;
};

/**
 * A disabled end button keeps the secondary look, only faded (Button's own
 * disabled state is a grey fill, which reads as a different control). cn has
 * no tailwind-merge, so the overrides are marked important; Button already
 * drops pointer events when disabled.
 */
const DISABLED_END =
  'disabled:border-line-strong! disabled:bg-surface! disabled:text-fg! disabled:shadow-card! disabled:opacity-50';

/**
 * The post list's pages, all pills: "Previous" and "Next" as secondary buttons
 * (disabled at either end) with the page numbers between them, the current one
 * on the pale tint. The list runs newest first, so "Next" goes to older posts.
 */
const Pagination = ({ page, postCount, globalPageProps, className }: Props) => {
  const { locale } = globalPageProps.params;
  const pageCount = postsPageCount(postCount);
  if (pageCount < 2) return null;

  const previous = uiLabel(locale, 'previousPage');
  const next = uiLabel(locale, 'nextPage');

  return (
    <nav
      aria-label={uiString(locale, 'pagination')}
      className={cn('flex items-center justify-between gap-4', className)}
    >
      {page > 1 ? (
        <Button
          variant="secondary"
          href={postsPageUrl(globalPageProps, page - 1)}
          rel="prev"
        >
          {previous}
        </Button>
      ) : (
        <Button variant="secondary" disabled className={DISABLED_END}>
          {previous}
        </Button>
      )}

      <ol className="flex flex-wrap items-center justify-center gap-1">
        {Array.from({ length: pageCount }, (_, index) => {
          const number = index + 1;
          const current = number === page;

          return (
            <li key={number}>
              <AppLink
                href={postsPageUrl(globalPageProps, number)}
                aria-current={current ? 'page' : undefined}
                // The page transition comes in from the side the page lies on (Previous and Next say it with rel)
                data-direction={number > page ? 'forward' : 'back'}
                aria-label={uiString(locale, 'pageOf', {
                  page: number,
                  total: pageCount,
                })}
                className={cn(
                  'grid size-11 place-items-center rounded-full text-small font-semibold tabular-nums transition-colors duration-150',
                  current
                    ? 'bg-tint text-accent-ink'
                    : 'text-fg-muted hover:bg-subtle hover:text-fg',
                )}
              >
                {number}
              </AppLink>
            </li>
          );
        })}
      </ol>

      {page < pageCount ? (
        <Button
          variant="secondary"
          href={postsPageUrl(globalPageProps, page + 1)}
          rel="next"
        >
          {next}
        </Button>
      ) : (
        <Button variant="secondary" disabled className={DISABLED_END}>
          {next}
        </Button>
      )}
    </nav>
  );
};

export default Pagination;
