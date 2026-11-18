'use client';

import { usePathname } from 'next/navigation';
import { uiString } from '@/lib/i18n/uiStrings';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import DocumentationSidebarItem from './DocumentationSidebarItem';
import { slugFromPathname, useDocsTree } from './docsTree';

type Props = {
  globalPageProps: ResolvedGlobalPageProps;
  size: 'rail' | 'sheet';
  onNavigate?: () => void;
};

/** The documentation tree: the sidebar from 1024px, the drawer below */
const DocsNav = ({ globalPageProps, size, onNavigate }: Props) => {
  const pages = useDocsTree();
  const currentSlug = slugFromPathname(usePathname());

  return (
    <nav aria-label={uiString(globalPageProps.params.locale, 'documentation')}>
      {/* The first group starts flush: its mt-* only separates groups */}
      <ul className="[&>li:first-child]:mt-0">
        {pages.map((page) => (
          <DocumentationSidebarItem
            key={page.id}
            page={page}
            depth={0}
            currentSlug={currentSlug}
            globalPageProps={globalPageProps}
            size={size}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
};

export default DocsNav;
