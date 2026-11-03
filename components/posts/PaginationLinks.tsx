import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { uiString } from '@/lib/i18n/uiStrings';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

type Props = {
  page: number;
  postCount: number;
  globalPageProps: ResolvedGlobalPageProps;
};

/** Posts per index page: the page-size of /posts and /posts/page/[page] */
export const POSTS_PER_PAGE = 9;

/** URL of a blog index page: page 1 is /posts itself, the others /posts/page/[page] */
export function postsPageUrl(
  globalPageProps: ResolvedGlobalPageProps,
  pageNumber: number,
) {
  return pageNumber === 1
    ? buildUrl(globalPageProps, '/posts')
    : buildUrl(globalPageProps, `/posts/page/${pageNumber}`);
}

/**
 * Page number links (and "Next") rendered as <li> items inside the caller's
 * pagination <ul>. The current page is a filled ink circle, so it reads
 * without relying on colour.
 */
const PaginationLinks = ({ page, postCount, globalPageProps }: Props) => {
  const { locale } = globalPageProps.params;
  // Route params arrive as strings at runtime, so coerce before doing arithmetic
  const currentPage = Number(page) || 1;
  const pageCount = Math.ceil(postCount / POSTS_PER_PAGE);
  const hasNextPage = postCount > currentPage * POSTS_PER_PAGE;

  const pageLinks = Array.from({ length: pageCount }, (_, i) => {
    const pageNumber = i + 1;
    const isCurrent = pageNumber === currentPage;

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
    <>
      {pageLinks}
      {hasNextPage && (
        <li>
          <Link
            href={postsPageUrl(globalPageProps, currentPage + 1)}
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
    </>
  );
};

export default PaginationLinks;
