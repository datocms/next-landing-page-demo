import type { Metadata } from 'next';
import { generatePageComponent } from '@/lib/datocms/realtime/generatePageComponent';
import {
  type BuildVariablesFn,
  resolveRouteContext,
} from '@/lib/datocms/routeContext';
import { localeParams } from '@/lib/datocms/staticParams';
import { uiString } from '@/lib/i18n/uiStrings';
import { primeUiStrings } from '@/lib/i18n/uiStrings/load';
import type { GlobalPageProps } from '@/utils/globalPageProps';
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

/** The page has no record of its own: its title is the interface text of its heading */
export async function generateMetadata(
  props: GlobalPageProps,
): Promise<Metadata> {
  const { pageProps, includeDrafts } = await resolveRouteContext<
    PageProps,
    Variables
  >(props);
  const { locale } = pageProps.params;
  await primeUiStrings(locale, includeDrafts);

  return { title: uiString(locale, 'allAuthors') };
}

const Page = generatePageComponent<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
