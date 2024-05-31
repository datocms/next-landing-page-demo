import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import { PageStaticParamsDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';
import getAvailableLocales from '@/app/i18n/settings';

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

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: ({ params, fallbackLocale }) => ({
    locale: params.locale,
    fallbackLocale: [fallbackLocale],
    slug: params.slug,
  }),
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
