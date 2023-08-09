import ScrollUp from '@/components/Common/ScrollUp';
import Sections from '@/components/Sections/Sections';
import { homeQuery } from '@/queries/home';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../i18n/settings';
import { draftMode } from 'next/headers';

export default async function Home({ params: { lng } }) {
  const { isEnabled } = draftMode();

  const { page } = await queryDatoCMS(
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
      <Sections locale={lng} sections={page.sections} />
    </>
  );
}
