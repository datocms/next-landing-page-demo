import { notFound } from 'next/navigation';
import DocsShell from '@/components/docs/DocsShell';
import Header from '@/components/layout/Header';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  if (!data.allDocumentationPages.length || !data.documentationHome) notFound();

  const { logo, footerText } = data.documentationHome;

  // The site's own header (logo, pill menu, languages) sits over the docs too
  return (
    <>
      <Header
        globalPageProps={globalPageProps}
        fragment={data.layout}
        languages={data._site.locales}
      />
      <DocsShell
        globalPageProps={globalPageProps}
        logo={logo}
        pages={data.allDocumentationPages}
        footerText={footerText}
        languages={data._site.locales}
      >
        {children}
      </DocsShell>
    </>
  );
};

export default Content;
