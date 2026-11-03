import { ViewTransition } from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import type { ContentPage } from '@/lib/datocms/realtime/types';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  return (
    <>
      <Header globalPageProps={globalPageProps} data={data} />
      {/* Pages fade inside it; this one fades when the layout itself is swapped (docs, another language) */}
      <ViewTransition enter="page-enter" exit="page-exit" default="none">
        <main id="main" className="min-h-[60svh]">
          {children}
        </main>
        <Footer globalPageProps={globalPageProps} data={data} />
      </ViewTransition>
    </>
  );
};

export default Content;
