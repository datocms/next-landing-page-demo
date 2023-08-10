import ScrollUp from '@/components/Common/ScrollUp';
import Sections from '@/components/Sections/Sections';
import { homeQuery } from '@/queries/home';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../i18n/settings';
import { draftMode } from 'next/headers';
import RealTimeSections from '@/components/Sections/RealTimeSections';

export default async function Home({ params: { lng } }) {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    homeQuery,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      <ScrollUp />
      {!isEnabled && <Sections locale={lng} sections={data.page.sections} />}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={homeQuery}
        />
      )}
    </>
  );
}
