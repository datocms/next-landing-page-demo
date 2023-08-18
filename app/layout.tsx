import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import './../styles/index.css';
import { draftMode } from 'next/headers';
import Head from './[lng]/Head';
import { SiteLocale } from '@/graphql/generated';
import { Inter } from 'next/font/google';
import GetMenuItems from '@/components/Header/GetMenuData';
import getAvailableLocales from './i18n/settings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
  const menuData = await GetMenuItems(lng, isEnabled);
  const languages = await getAvailableLocales();

  return (
    <html suppressHydrationWarning lang={lng}>
      <Head />
      <body className={`tracking-tight antialiased`}>{children}</body>
    </html>
  );
}
