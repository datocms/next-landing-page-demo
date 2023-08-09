import { fallbackLng } from '@/app/i18n/settings';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { aboutQuery } from '@/queries/about';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import Sections from '@/components/Sections/Sections';

const AboutPage = async ({ params: { lng } }) => {
  const { isEnabled } = draftMode();

  const { page } = await queryDatoCMS(
    aboutQuery,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      <Breadcrumb pageName="About Us" description="" />
      <Sections locale={lng} sections={page.sections} />
    </>
  );
};

export default AboutPage;
