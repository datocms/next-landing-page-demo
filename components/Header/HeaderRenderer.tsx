import { getFallbackLocale } from '@/app/i18n/settings';
import RealTimeHeader from '@/components/Header/RealTimeHeader';
import { MenuDocument, type SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Header from '.';

type Props = {
  lng: SiteLocale;
  isDraft: boolean;
};

export type Menu = {
  id: string;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

export type NotificationStripType = {
  displayNotification: boolean;
  text: string;
  urlLabel: string | null | undefined;
  url: string | undefined | null;
};

const HeaderRenderer = async ({ lng, isDraft }: Props) => {
  const fallbackLng = await getFallbackLocale();
  const data = await queryDatoCMS(
    MenuDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isDraft,
  );

  return (
    <>
      {!isDraft && <Header lng={lng} data={data} />}
      {isDraft && (
        <RealTimeHeader
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={MenuDocument}
          variables={{ locale: lng, fallbackLocale: fallbackLng }}
        />
      )}
    </>
  );
};

export default HeaderRenderer;
