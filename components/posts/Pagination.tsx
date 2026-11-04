import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { postsPageUrl } from '@/utils/routes';
import { POSTS_PER_PAGE, postsPageCount } from './postsPagination';

type Props = {
  /** The current page, from 1 */
  page: number;
  postCount: number;
  globalPageProps: ResolvedGlobalPageProps;
};

/**
 * The blog index's page links: Previous, the page numbers and Next. The
 * current page is a filled ink circle, so it reads without relying on colour.
 */
const Pagination = ({ page, postCount, globalPageProps }: Props) => {
  const { locale } = globalPageProps.params;
  const pageCount = postsPageCount(postCount);
  const hasNextPage = postCount > page * POSTS_PER_PAGE;

  const pageLinks = Array.from({ length: pageCount }, (_, i) => {
    const pageNumber = i + 1;
    const isCurrent = pageNumber === page;

    return (
      <li key={pageNumber}>
        <Link
          href={postsPageUrl(globalPageProps, pageNumber)}
          aria-current={isCurrent ? 'page' : undefined}
          aria-label={uiString(locale, 'pageOf', {
            page: pageNumber,
            total: pageCount,
          })}
          className="btn btn-secondary btn-icon text-ui tabular-nums aria-[current=page]:bg-ink aria-[current=page]:text-white aria-[current=page]:shadow-none"
        >
          {pageNumber}
        </Link>
      </li>
    );
  });

  return (
    <nav
      aria-label={uiString(locale, 'pagination')}
      className="mt-12 flex justify-center"
    >
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link
              href={postsPageUrl(globalPageProps, page - 1)}
              rel="prev"
              className="btn btn-secondary btn-sm h-10 max-md:h-11 pointer-coarse:h-11"
            >
              <ChevronLeft
                strokeWidth={1.75}
                aria-hidden="true"
                className="btn-arrow-back rtl:rotate-180"
              />
              {uiString(locale, 'previous')}
            </Link>
          </li>
        )}
        {pageLinks}
        {hasNextPage && (
          <li>
            <Link
              href={postsPageUrl(globalPageProps, page + 1)}
              rel="next"
              className="btn btn-secondary btn-sm h-10 max-md:h-11 pointer-coarse:h-11"
            >
              {uiString(locale, 'next')}
              <ChevronRight
                aria-hidden="true"
                strokeWidth={1.75}
                className="btn-arrow rtl:rotate-180"
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
