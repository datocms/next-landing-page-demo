import ScrollUp from '@/components/Common/ScrollUp';
import Sections from '@/components/Sections/Sections';
import { homeQuery } from '@/queries/home';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../i18n/settings';

export default async function Home({ params: { lng } }) {
  const { home } = await queryDatoCMS(homeQuery, {
    locale: lng,
    fallbackLocale: [fallbackLng],
  });

  return (
    <>
      <ScrollUp />
      <Sections locale={lng} sections={home.sections} />
    </>
  );
}
