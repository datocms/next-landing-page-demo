import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  return (
    <>
      <Header globalPageProps={globalPageProps} data={data} />
      {children}
      <Footer globalPageProps={globalPageProps} data={data} />
    </>
  );
};

export default Content;
