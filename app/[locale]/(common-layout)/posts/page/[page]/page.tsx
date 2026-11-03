import { POSTS_PER_PAGE } from '@/components/posts/PaginationLinks';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import type { BuildVariablesFn } from '@/lib/datocms/routeContext';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.locale,
  fallbackLocale: [fallbackLocale],
  first: POSTS_PER_PAGE,
  skip: (params.page - 1) * POSTS_PER_PAGE,
});

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
