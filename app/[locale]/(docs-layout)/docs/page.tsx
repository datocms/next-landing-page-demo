import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import type { BuildVariablesFn } from '@/lib/datocms/routeContext';
import { localeParams } from '@/lib/datocms/staticParams';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

/** Prerendered at build time (lib/datocms/staticParams.ts); a newer record renders on its first visit */
export const generateStaticParams = () => localeParams();

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.locale,
  fallbackLocales: [fallbackLocale],
});

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
    pickSeoMetaTags: (data) => data.documentationHome?.seo,
  },
);

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
