import CustomColor from '@/components/Common/CustomColor';
import ScrollToTop from '@/components/ScrollToTop';
import { CustomColorDocument } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import 'node_modules/react-modal-video/css/modal-video.css';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
  ...globalPageProps
}: Params) {
  const { isEnabled: isDraft } = draftMode();
  const data = await queryDatoCMS(CustomColorDocument, {}, isDraft);

  return (
    <>
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <ScrollToTop globalPageProps={globalPageProps} isDraft={isDraft} />
    </>
  );
}
