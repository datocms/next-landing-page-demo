import { POSTS_PER_PAGE } from '@/components/posts/postsPagination';
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
  query PageStaticParamsQuery {
    allPages(first: 500) {
      slug
    }
  }
`);

/** Prerenders every page in every locale at build time */
export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const { allPages } = await executeQuery(staticParamsQuery);

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
