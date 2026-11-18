import { POSTS_PER_PAGE } from '@/components/posts/postsPagination';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import type { BuildVariablesFn } from '@/lib/datocms/routeContext';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

/** Renders on demand: the content comes from the visitor's demo project (see lib/datocms/apiToken.ts) */
export async function generateStaticParams(): Promise<PageProps['params'][]> {
  return [];
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.locale,
  fallbackLocales: [fallbackLocale],
  slug: params.slug,
  // The All posts block lists the first page of posts
  postsPerPage: POSTS_PER_PAGE,
});

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
    pickSeoMetaTags: (data) => data.page?.seo,
  },
);

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
