import getAvailableLocales from '@/app/i18n/settings';
import CustomColor from '@/components/CustomColor';
import ScrollToTop from '@/components/ScrollToTop';
import { LayoutDocument, type SiteLocale } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export async function generateMetadata() {
  const { isEnabled: isDraft } = await draftMode();
  const data = await queryDatoCMS(LayoutDocument, {}, isDraft);
  return toNextMetadata(data._site.faviconMetaTags);
}

export default async function RootLayout({ children, params }: Params) {
  const { isEnabled: isDraft } = await draftMode();
  const rawParams = await params;
  const allLocales: string[] = await getAvailableLocales();

  // Only try to match against valid locales for this site, not any random string
  if (!allLocales.includes(rawParams.locale)) {
    notFound();
  }

  // Cast to SiteLocale after validation
  const resolvedParams = {
    locale: rawParams.locale as SiteLocale,
  };

  const data = await queryDatoCMS(LayoutDocument, {}, isDraft);

  return (
    <>
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <ScrollToTop globalPageProps={{ params: resolvedParams }} isDraft={isDraft} />
    </>
  );
}
