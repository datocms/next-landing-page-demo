import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { CustomColorDocument, SiteLocale } from '@/graphql/generated';
import getAvailableLocales from '@/app/i18n/settings';
import CustomColor from '@/components/Common/CustomColor';
import queryDatoCMS from '@/utils/queryDatoCMS';

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
  const data = await queryDatoCMS(CustomColorDocument, {}, isEnabled);

  return (
    <>
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <ScrollToTop lng={lng} isDraft={isEnabled} />
    </>
  );
}
