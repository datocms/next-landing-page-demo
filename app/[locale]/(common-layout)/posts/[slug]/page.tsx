import getAvailableLocales from '@/app/i18n/settings';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import {
  PostDocument,
  PostStaticParamsDocument,
  type SiteLocale,
} from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { toNextMetadata } from 'react-datocms/seo';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const { allPosts } = await queryDatoCMS(PostStaticParamsDocument);

  return allPosts.flatMap((page) =>
    locales.map((locale): PageProps['params'] => ({
      slug: page.slug,
      locale,
    })),
  );
}

export async function generateMetadata(props: PageProps) {
  const response = await queryDatoCMS(PostDocument, {
    slug: props.params.slug,
    locale: props.params.locale,
    fallbackLocale: 'en' as SiteLocale,
  });

  if (!response.post) {
    return {};
  }

  return toNextMetadata(response.post.seo);
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
