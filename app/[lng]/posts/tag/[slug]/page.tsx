import { fallbackLng } from '@/app/i18n/settings';
import PageIndicatorList from '@/components/Blog/PageIndicatorList';
import RealTimeTagPosts from '@/components/Blog/RealTimeTagPosts';
import SingleBlog from '@/components/Blog/SingleBlog';
import TagPosts from '@/components/Blog/TagPosts';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { postsQuery } from '@/queries/posts';
import { tagQuery } from '@/queries/tag';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

const TagPage = async ({ params }) => {
  const { lng } = params;
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    tagQuery,
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
          token={process.env.DATOCMS_READONLY_API_TOKEN}
          query={tagQuery}
          slug={params.slug}
        />
      )}
    </>
  );
};

export default TagPage;
