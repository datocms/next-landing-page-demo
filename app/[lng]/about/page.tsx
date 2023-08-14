import { fallbackLng } from '@/app/i18n/settings';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import Sections from '@/components/Sections/Sections';
import RealTimeSections from '@/components/Sections/RealTimeSections';
import {
  AboutDocument,
  PageModelSectionsField,
  SiteLocale,
} from '@/graphql/generated';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

const AboutPage = async ({ params: { lng } }: Params) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    AboutDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && (
        <Sections
          locale={lng}
          sections={data.page!.sections as Array<PageModelSectionsField>}
        />
      )}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={AboutDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default AboutPage;
