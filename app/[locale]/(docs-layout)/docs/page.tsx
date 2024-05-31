import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    generate: (data) => data.documentationHome?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
