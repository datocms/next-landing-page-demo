'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRightIcon } from '@/components/ui/icons';
import { uiLabel, uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsPageUrl } from '@/utils/routes';
import { flattenTree, slugFromPathname, useDocsTree } from './docsTree';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  className?: string;
};

/**
 * The previous and next pages in the tree's reading order, as two tiles named
 * by the pages' titles: the previous one pale, the next one in the accent (the
 * way forward), each with its arrow on a disc. Under the pointer a tile lifts
 * 2px and its arrow slides the way it points.
 */
const DocsPager = ({ globalPageProps, className }: Props) => {
  const pages = flattenTree(useDocsTree());
  const currentSlug = slugFromPathname(usePathname());
  const { locale } = globalPageProps.params;

  const index = pages.findIndex((page) => page.slug === currentSlug);
  if (index === -1) return null;

  const links = [
    { page: pages[index - 1], label: uiLabel(locale, 'previousPage') },
    { page: pages[index + 1], label: uiLabel(locale, 'nextPage') },
  ];
  if (!links[0].page && !links[1].page) return null;

  return (
    <nav
      aria-label={uiString(locale, 'docsPagination')}
      className={cn('grid gap-3 sm:grid-cols-2 sm:gap-4', className)}
    >
      {links.map(({ page, label }, position) => {
        if (!page) return null;
        const next = position === 1;

        return (
          <Link
            key={page.id}
            href={docsPageUrl(globalPageProps, page.slug)}
            rel={next ? 'next' : 'prev'}
            className={cn(
              'group relative flex min-h-[8.5rem] flex-col justify-between gap-6 overflow-hidden rounded-card p-6 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:hover:-translate-y-0.5',
              next
                ? 'bg-accent text-on-accent sm:col-start-2 sm:items-end sm:text-end'
                : 'bg-subtle text-fg',
            )}
          >
            <span
              className={cn(
                'flex items-center gap-3 text-small font-medium',
                next ? 'flex-row-reverse text-on-accent/85' : 'text-fg-muted',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'grid size-9 place-items-center rounded-full',
                  next
                    ? 'bg-[rgb(255_255_255/0.16)] text-on-accent'
                    : 'bg-surface text-accent-ink',
                )}
              >
                <ArrowRightIcon
                  className={cn(
                    'size-4 transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
                    next
                      ? 'group-hover:translate-x-0.5'
                      : 'rotate-180 group-hover:-translate-x-0.5',
                  )}
                />
              </span>
              {label}
            </span>
            <span className="text-balance font-semibold text-[1.375rem] leading-[1.15] tracking-[-0.03em]">
              <span className="title-underline">{page.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DocsPager;
