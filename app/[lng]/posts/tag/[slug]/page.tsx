import { getFallbackLocale } from '@/app/i18n/settings';
import RealTimeTagPosts from '@/components/Blog/RealTime/RealTimeTagPosts';
import TagPosts from '@/components/Blog/TagPosts';
import { SiteLocale, TagDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const TagPage = async ({ params }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { lng } = params;
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    TagDocument,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      slug: params.slug,
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <TagPosts data={data} lng={lng} />}
      {isEnabled && (
        <RealTimeTagPosts
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={TagDocument}
          variables={{
            locale: lng,
            fallbackLocale: fallbackLng,
            slug: params.slug,
          }}
        />
      )}
    </>
  );
};

export default TagPage;
