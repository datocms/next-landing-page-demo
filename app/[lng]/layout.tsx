import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import '../../styles/index.css';
import { Providers } from './providers';
import { languages } from '../i18n/settings';
import { draftMode } from 'next/headers';
import Head from './Head';

export async function generateStaticParams() {
  return languages.map((language) => {
    language;
  });
}

export default function RootLayout({ children, params: { lng } }) {
  const { isEnabled } = draftMode();

  return (
    <html suppressHydrationWarning lang={lng}>
      <Head />
      <body>
        <Providers>
          <Header lng={lng} isDraft={isEnabled} />
          {children}
          <Footer lng={lng} />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
