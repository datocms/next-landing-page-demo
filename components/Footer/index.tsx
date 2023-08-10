import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '@/app/i18n/settings';
import { draftMode } from 'next/headers';
import FooterRenderer from './FooterRenderer';
import RealTimeFooter from './RealTimeFooter';
import { footerQuery } from '@/queries/footer';

const Footer = async ({ lng }) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    footerQuery,
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
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={footerQuery}
        />
      )}
    </>
  );
};

export default Footer;
