import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
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
  slug: params.slug,
});

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
    generate: (data) => data.legalPage?.seo,
  },
);

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
