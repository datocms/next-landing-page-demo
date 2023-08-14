import { fallbackLng } from '@/app/i18n/settings';
import PostGridRenderer from '@/components/Blog/PostGridRenderer';
import RealTimePostGridRenderer from '@/components/Blog/RealTime/RealTimePostGridRenderer';
import { PostsDocument, SiteLocale } from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

const Blog = async ({ params: { lng } }: Params) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    PostsDocument,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <PostGridRenderer data={data} lng={lng} />}
      {isEnabled && (
        <RealTimePostGridRenderer
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={PostsDocument}
          variables={{ locale: lng, fallbackLocale: fallbackLng }}
        />
      )}
    </>
  );
};

export default Blog;
