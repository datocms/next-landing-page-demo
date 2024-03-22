import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import FooterRenderer from './FooterRenderer';
import RealTimeFooter from './RealTimeFooter';
import { FooterDocument, SiteLocale } from '@/graphql/types/graphql';
import { getFallbackLocale } from '@/app/i18n/settings';

type Props = {
  lng: SiteLocale;
};

const Footer = async ({ lng }: Props) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    FooterDocument,
    { locale: lng, fallbackLocale: fallbackLng },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <FooterRenderer data={data} lng={lng} />}{' '}
      {isEnabled && (
        <RealTimeFooter
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={FooterDocument}
          variables={{ locale: lng, fallbackLocale: fallbackLng }}
        />
      )}
    </>
  );
};

export default Footer;
