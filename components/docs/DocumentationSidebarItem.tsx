'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { docsPageUrl } from '@/utils/routes';
import { childPages, type DocsTreePage } from './docsTree';

type Props = {
  page: DocsTreePage;
  /** 0 for a top-level page: it heads its group; its subpages hang on a rail under it */
  depth: number;
  currentSlug: string;
  globalPageProps: ResolvedGlobalPageProps;
  /** `rail`: the desktop sidebar (15px rows); `sheet`: the drawer (16px, 44px rows) */
  size: 'rail' | 'sheet';
  /** Called when a link is followed, so the drawer closes */
  onNavigate?: () => void;
};

/** Whether the current page is this page or one of its subpages */
const containsSlug = (page: DocsTreePage, slug: string): boolean =>
  page.slug === slug ||
  childPages(page).some((child) => containsSlug(child, slug));

/**
 * One page of the docs tree and, under it, its subpages (always shown: the
 * tree is short enough to read whole).
 *
 * A main topic (top level) heads its group in ink and semibold, beside a small
 * square that fills with the accent while the reader is inside that group. Its
 * child topics hang on a hairline rail under it; a child topic's own subtopics
 * hang on a rail of their own, indented under that topic and one step smaller,
 * so each level reads as part of the one above. The current page is a pale pill
 * (bg-tint) with the accent as text, and on its rail a 2px accent mark.
 */
const DocumentationSidebarItem = ({
  page,
  depth,
  currentSlug,
  globalPageProps,
  size,
  onNavigate,
}: Props) => {
  const subpages = childPages(page);
  const isCurrent = page.slug === currentSlug;
  const isTop = depth === 0;
  const inGroup = isTop && containsSlug(page, currentSlug);

  const subtree = subpages.map((child) => (
    <DocumentationSidebarItem
      key={child.id}
      page={child}
      depth={depth + 1}
      currentSlug={currentSlug}
      globalPageProps={globalPageProps}
      size={size}
      onNavigate={onNavigate}
    />
  ));

  if (isTop) {
    return (
      <li className={size === 'rail' ? 'mt-7' : 'mt-6'}>
        <Link
          href={docsPageUrl(globalPageProps, page.slug)}
          aria-current={isCurrent ? 'page' : undefined}
          onClick={onNavigate}
          className={cn(
            'group/top -mx-3 flex items-center gap-3 rounded-control px-3 font-semibold text-fg tracking-[-0.01em] transition-colors duration-150 hover:bg-subtle aria-[current]:bg-tint aria-[current]:text-accent-ink',
            size === 'rail'
              ? 'min-h-9 py-1 text-small pointer-coarse:min-h-11'
              : 'min-h-11 py-1.5 text-body',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-2 shrink-0 rounded-[3px] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
              inGroup
                ? 'rotate-45 bg-accent'
                : 'bg-line-strong group-hover/top:bg-fg-faint',
            )}
          />
          <span>{page.title}</span>
        </Link>

        {subpages.length > 0 && (
          // The rail lines up under the group's square
          <ul className="mt-1 ms-[3px] border-line border-s">{subtree}</ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={docsPageUrl(globalPageProps, page.slug)}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={onNavigate}
        className={cn(
          'relative ms-2 flex items-center rounded-control ps-3 pe-3 text-fg-muted transition-colors duration-150 hover:bg-subtle hover:text-fg aria-[current]:bg-tint aria-[current]:font-medium aria-[current]:text-accent-ink',
          // The mark on the rail: the hairline darkens under the current page
          'before:absolute before:inset-y-1.5 before:-start-[calc(0.5rem+1px)] before:w-0.5 before:rounded-full before:bg-transparent before:transition-colors before:duration-150 aria-[current]:before:bg-accent-edge',
          size === 'rail'
            ? cn(
                'min-h-8 py-1 pointer-coarse:min-h-11',
                depth > 1 ? 'text-[0.8125rem]' : 'text-small',
              )
            : 'min-h-11 py-1.5 text-body',
        )}
      >
        <span>{page.title}</span>
      </Link>

      {subpages.length > 0 && (
        // The subtopics' own rail, indented under this topic's text
        <ul className="my-0.5 ms-5 border-line border-s">{subtree}</ul>
      )}
    </li>
  );
};

export default DocumentationSidebarItem;
