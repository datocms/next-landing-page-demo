import Sections from '@/components/Sections/Sections';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { fallbackLng } from '../../i18n/settings';
import { draftMode } from 'next/headers';
import RealTimeSections from '@/components/Sections/RealTimeSections';
import {
  CollectionMetadata,
  PageDocument,
  PageModelSectionsField,
  PostRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    lng: SiteLocale;
    slug: string;
  };
};

export default async function Home({ params: { lng, slug } }: Params) {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    PageDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
      slug,
    },
    isEnabled
  );

  if (!data.page) notFound();

  return (
    <>
      {!isEnabled && (
        <Sections
          locale={lng}
          sections={data.page.sections as Array<PageModelSectionsField>}
          posts={data.allPosts as PostRecord[]}
          postMeta={data._allPostsMeta as CollectionMetadata}
        />
      )}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={PageDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng], slug }}
        />
      )}
    </>
  );
}
