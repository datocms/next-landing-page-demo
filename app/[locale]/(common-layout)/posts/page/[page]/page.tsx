import { notFound } from 'next/navigation';
import { POSTS_PER_PAGE } from '@/components/posts/postsPagination';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import type { BuildVariablesFn } from '@/lib/datocms/routeContext';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => {
  // Only canonical page numbers: abc, 0, 02 or 1.5 is a 404, not a query the API rejects
  if (!/^[1-9]\d*$/.test(params.page)) notFound();
  const page = Number(params.page);

  return {
    locale: params.locale,
    fallbackLocales: [fallbackLocale],
    postsPerPage: POSTS_PER_PAGE,
    skip: (page - 1) * POSTS_PER_PAGE,
  };
};

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
