import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import '../../styles/index.css';
import { languages } from '../i18n/settings';
import { draftMode } from 'next/headers';
import Head from './Head';
import { SiteLocale } from '@/graphql/generated';
import { Inter } from 'next/font/google';

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
  return languages.map((language) => {
    language;
  });
}

export default function RootLayout({ children, params: { lng } }: Params) {
  const { isEnabled } = draftMode();

  return (
    <html suppressHydrationWarning lang={lng}>
      <Head />
      <body className={`tracking-tight antialiased ${inter.variable}`}>
        <Header lng={lng} isDraft={isEnabled} />
        {children}
        <Footer lng={lng} />
        <ScrollToTop />
      </body>
    </html>
  );
}
