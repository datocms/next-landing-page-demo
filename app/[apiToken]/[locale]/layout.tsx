import getAvailableLocales from '@/app/i18n/settings';
import CustomColor from '@/components/CustomColor';
import ScrollToTop from '@/components/ScrollToTop';
import { LayoutDocument } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import 'node_modules/react-modal-video/css/modal-video.css';
import { toNextMetadata } from 'react-datocms/seo';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Params) {
  const { isEnabled: isDraft } = draftMode();
  const data = await queryDatoCMS(params.apiToken, LayoutDocument, {}, isDraft);
  return toNextMetadata(data._site.faviconMetaTags);
}

export default async function RootLayout({ children, ...pageProps }: Params) {
  const { isEnabled: isDraft } = draftMode();
  const allLocales: string[] = await getAvailableLocales(pageProps.params.apiToken);

  // Only try to match against valid locales for this site, not any random string
  if (!allLocales.includes(pageProps.params.locale)) {
    notFound();
  }

  const data = await queryDatoCMS(pageProps.params.apiToken, LayoutDocument, {}, isDraft);

  return (
    <>
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <ScrollToTop globalPageProps={pageProps} isDraft={isDraft} />
    </>
  );
}
