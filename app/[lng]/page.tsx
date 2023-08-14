import ScrollUp from '@/components/Common/ScrollUp';
import Sections from '@/components/Sections/Sections';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../i18n/settings';
import { draftMode } from 'next/headers';
import RealTimeSections from '@/components/Sections/RealTimeSections';
import {
  HomeDocument,
  PageModelSectionsField,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

export default async function Home({ params: { lng } }: Params) {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    HomeDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  if (!data.page) notFound();

  return (
    <>
      <ScrollUp />
      {!isEnabled && (
        <Sections
          locale={lng}
          sections={data.page.sections as Array<PageModelSectionsField>}
          //to ask: why do i have to use "as" here?
        />
      )}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={HomeDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
}
