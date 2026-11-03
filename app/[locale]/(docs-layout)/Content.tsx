import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocumentationSidebarItem from '@/components/docs/DocumentationSidebarItem';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import { uiString } from '@/lib/i18n/uiStrings';
import { buildUrl } from '@/utils/globalPageProps';
import DocsShell from './DocsShell';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  if (!data.allDocumentationPages.length || !data.documentationHome) notFound();

  const { logo, footerText } = data.documentationHome;
  const { locale } = globalPageProps.params;

  // Handed to the client shell as ready-made nodes: a server component can't pass
  // it render functions
  const brand = (
    <Link
      href={buildUrl(globalPageProps, '/docs')}
      aria-label={uiString(locale, 'docsHome')}
      className="hit-44 flex shrink-0 items-center gap-2.5 rounded-lg"
    >
      {logo?.url ? (
        <Image
          src={logo.url}
          alt=""
          width={logo.width || 140}
          height={logo.height || 30}
          className="h-[22px] w-auto lg:h-6"
          preload
        />
      ) : (
        <span aria-hidden="true" className="ring-mark size-5" />
      )}
      <span className="badge">{uiString(locale, 'docsBadge')}</span>
    </Link>
  );

  const nav = (
    <nav aria-label={uiString(locale, 'documentation')}>
      <ul className="space-y-0.5">
        {data.allDocumentationPages.map((page) => (
          <DocumentationSidebarItem
            key={page.id}
            page={page}
            globalPageProps={globalPageProps}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <DocsShell
      brand={brand}
      nav={nav}
      siteHref={buildUrl(globalPageProps, '/home')}
      footerText={footerText}
      locale={locale}
    >
      {children}
    </DocsShell>
  );
};

export default Content;
