import { fallbackLng } from '@/app/i18n/settings';
import PageIndicatorList from '@/components/Blog/PageIndicatorList';
import PostGridRenderer from '@/components/Blog/PostGridRenderer';
import RealTimePostGridRenderer from '@/components/Blog/RealTimePostGridRenderer';
import SingleBlog from '@/components/Blog/SingleBlog';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { postsQuery } from '@/queries/posts';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

const Blog = async ({ params: { lng } }) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    postsQuery,
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
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={postsQuery}
        />
      )}
    </>
  );
};

export default Blog;
