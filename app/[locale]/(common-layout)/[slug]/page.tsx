import getAvailableLocales from '@/app/i18n/settings';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { PageStaticParamsDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const { allPages } = await queryDatoCMS(PageStaticParamsDocument);

  return allPages.flatMap((page) =>
    locales.map((locale): PageProps['params'] => ({
      slug: page.slug,
      locale,
    })),
  );
}

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
    generate: (data) => data.page?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
