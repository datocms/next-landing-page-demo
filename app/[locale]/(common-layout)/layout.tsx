import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

const layout = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: ({ params, fallbackLocale }) => ({
    locale: params.locale,
    fallbackLocale: [fallbackLocale],
  }),
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default layout;
