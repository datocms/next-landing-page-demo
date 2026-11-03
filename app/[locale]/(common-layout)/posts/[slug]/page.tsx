import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { graphql } from '@/lib/datocms/graphql';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import type { BuildVariablesFn } from '@/lib/datocms/routeContext';
import { getAvailableLocales } from '@/lib/i18n/locales';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

const staticParamsQuery = graphql(/* GraphQL */ `
  query PostStaticParamsQuery {
    allPosts(
      filter: { title: { isBlank: "false" } }
      orderBy: _createdAt_DESC
      first: 9
    ) {
      slug
    }
  }
`);

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const { allPosts } = await executeQuery(staticParamsQuery);

  return allPosts.flatMap((post) =>
    locales.map((locale): PageProps['params'] => ({
      slug: post.slug,
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
    generate: (data) => data.post?.seo,
  },
);

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
