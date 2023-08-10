import { fallbackLng } from '@/app/i18n/settings';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { aboutQuery } from '@/queries/about';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import Sections from '@/components/Sections/Sections';
import RealTimeSections from '@/components/Sections/RealTimeSections';

const AboutPage = async ({ params: { lng } }) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    aboutQuery,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <Sections locale={lng} sections={data.page.sections} />}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={aboutQuery}
        />
      )}
    </>
  );
};

export default AboutPage;
