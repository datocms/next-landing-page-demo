'use client';

import { stripStega } from '@datocms/content-link';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { uiString } from '@/lib/i18n/uiStrings';
import { cn } from '@/utils/cn';
import {
  buildUrl,
  type ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

type SidebarPage = {
  id: string;
  slug: string;
  title: string;
  children?: (SidebarPage | null)[] | null;
};

type Props = {
  page: SidebarPage;
  globalPageProps: ResolvedGlobalPageProps;
};

// Row link. The hover fill comes from --row-hover (white on the tinted rail, the
// well tint in the white drawer). Inset focus ring: the tree sits in scroll and
// collapse containers that clip outlines. Rows grow to 44px in the drawer and on
// touch screens.
const rowClass =
  'flex min-h-9 min-w-0 flex-1 items-center rounded-panel px-3 py-1.5 text-small transition-colors duration-150 focus-visible:-outline-offset-2 max-lg:min-h-11 pointer-coarse:min-h-11';

const hoverClass = 'hover:bg-(--row-hover) hover:text-ink';

// The current page: accent text (7.9:1 on the accent wash)
const currentTextClass = 'font-medium text-accent-text';

/** Whether `page` or any page below it has this slug */
function treeHasSlug(page: SidebarPage, slug: string): boolean {
  return (
    stripStega(page.slug) === slug ||
    (page.children ?? []).some((child) => !!child && treeHasSlug(child, slug))
  );
}

/**
 * One page of the docs tree: a link row and, when the page has subpages, a
 * toggle that expands them below it (the branch holding the current page
 * starts open)
 */
const DocumentationSidebarItem = ({ page, globalPageProps }: Props) => {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').at(-1) ?? '';
  const childListId = useId();

  const href = buildUrl(globalPageProps, `/docs/${stripStega(page.slug)}`);
  const isCurrent = stripStega(page.slug) === currentSlug;
  const childPages = (page.children ?? []).filter(
    (child): child is SidebarPage => Boolean(child),
  );
  const isLeaf = childPages.length === 0;
  const branchIsActive = !isLeaf && treeHasSlug(page, currentSlug);

  // Open on the active branch, and open again when navigation moves into it
  const [expanded, setExpanded] = useState(branchIsActive);
  const [lastBranchIsActive, setLastBranchIsActive] = useState(branchIsActive);
  if (branchIsActive !== lastBranchIsActive) {
    setLastBranchIsActive(branchIsActive);
    if (branchIsActive) setExpanded(true);
  }

  // A current leaf carries the accent wash itself; a current parent's whole row does
  const linkClass = isCurrent
    ? cn(rowClass, isLeaf && 'bg-accent-wash', currentTextClass)
    : cn(
        rowClass,
        branchIsActive ? 'font-medium text-ink' : 'text-ink-2',
        hoverClass,
      );

  const link = (
    <Link
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      className={linkClass}
    >
      {page.title}
    </Link>
  );

  if (isLeaf) {
    return <li>{link}</li>;
  }

  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-0.5 rounded-panel',
          isCurrent && 'bg-accent-wash',
        )}
      >
        {link}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={childListId}
          aria-label={stripStega(
            uiString(globalPageProps.params.locale, 'subpagesOf', {
              title: page.title,
            }),
          )}
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-[8px] transition-colors duration-150 hover:bg-(--row-hover) hover:text-ink focus-visible:-outline-offset-2 max-lg:size-11 pointer-coarse:size-11',
            isCurrent ? 'text-accent-text' : 'text-ink-3',
          )}
        >
          <ChevronRight
            strokeWidth={1.75}
            aria-hidden="true"
            className={cn(
              'size-4 duration-200 ease-out-quint motion-safe:transition-transform',
              expanded && 'rotate-90',
            )}
          />
        </button>
      </div>

      {/* CSS-only collapse: the row track eases between 0fr and 1fr, and the
          list turns invisible (unfocusable) once it has closed */}
      <div
        id={childListId}
        className={cn(
          'grid transition-[grid-template-rows,visibility] duration-200 ease-out-quint',
          expanded ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="mt-0.5 ms-3 space-y-0.5 border-s border-line ps-2">
            {childPages.map((child) => (
              <DocumentationSidebarItem
                key={child.id}
                page={child}
                globalPageProps={globalPageProps}
              />
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default DocumentationSidebarItem;
