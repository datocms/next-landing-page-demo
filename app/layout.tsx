import 'node_modules/react-modal-video/css/modal-video.css';
import '@/styles/global.css';
import { SiteLocale } from '@/graphql/types/graphql';
import getAvailableLocales from '@/app/i18n/settings';
import Head from './[lng]/Head';

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
  return (
    <html lang={lng}>
      <Head />
      <body className={`tracking-tight antialiased`}>{children}</body>
    </html>
  );
}
