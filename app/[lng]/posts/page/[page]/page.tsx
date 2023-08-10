import { fallbackLng } from '@/app/i18n/settings';
import PostsPage from '@/components/Blog/PostsPage';
import RealTimePostsPage from '@/components/Blog/RealTimePostsPage';
import { postsQuery } from '@/queries/posts';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

const Blog = async ({ params }) => {
  const { lng } = params;
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    postsQuery,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      skip: (params.page - 1) * 9,
    },
    isEnabled
  );

  if (!data.allPosts.length) {
    notFound();
  }

  return (
    <>
      {!isEnabled && <PostsPage data={data} lng={lng} page={params.page} />}
      {isEnabled && (
        <RealTimePostsPage
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={postsQuery}
          skip={(params.page - 1) * 9}
          page={params.page}
        />
      )}
    </>
  );
};

export default Blog;
