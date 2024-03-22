import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { SiteLocale } from '@/graphql/types/graphql';
import getAvailableLocales from '../../i18n/settings';
import HeaderRenderer from '@/components/Header/HeaderRenderer';

type Params = {
  children: React.ReactNode;
  params: {
    lng: SiteLocale;
  };
};

export async function generateStaticParams() {
  const languages = await getAvailableLocales();
  return languages.map((language) => {
    language;
  });
}

export default async function RootLayout({
  children,
  params: { lng },
}: Params) {
  const { isEnabled } = draftMode();

  return (
    <>
      <HeaderRenderer lng={lng} isDraft={isEnabled} />
      {children}
      <Footer lng={lng} />
      <ScrollToTop lng={lng} isDraft={isEnabled} />
    </>
  );
}
