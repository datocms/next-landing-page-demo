import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import type { ContentComponent } from '@/lib/datocms/realtime/types';
import type { PageProps, Query } from './meta';

const Content: ContentComponent<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  return (
    <>
      <Header
        globalPageProps={globalPageProps}
        fragment={data.layout}
        languages={data._site.locales}
      />
      {/* Pages fade inside it; this one fades when the layout itself is swapped (docs, another language) */}
      <PageTransition>
        <main id="main" className="min-h-[60svh]">
          {children}
        </main>
        <Footer
          globalPageProps={globalPageProps}
          fragment={data.layout}
          languages={data._site.locales}
        />
      </PageTransition>
    </>
  );
};

export default Content;
