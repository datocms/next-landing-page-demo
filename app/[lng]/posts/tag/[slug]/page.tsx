import { fallbackLng } from '@/app/i18n/settings';
import PageIndicatorList from '@/components/Blog/PageIndicatorList';
import SingleBlog from '@/components/Blog/SingleBlog';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { postsQuery } from '@/queries/posts';
import { tagQuery } from '@/queries/tag';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';

const TagPage = async ({ params }) => {
  const { lng } = params;
  const { isEnabled } = draftMode();

  const initialData = await queryDatoCMS(
    tagQuery,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      slug: params.slug,
    },
    isEnabled
  );

  const { _allReferencingPosts: allPosts } = initialData.tag;

  return (
    <>
      <Breadcrumb pageName={initialData.tag.tag} description="" />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {allPosts.map((post) => (
              <div
                key={post.id}
                className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleBlog blog={post} locale={lng} />
              </div>
            ))}
          </div>

          <div
            className="wow fadeInUp -mx-4 flex flex-wrap"
            data-wow-delay=".15s"
          ></div>
        </div>
      </section>
    </>
  );
};

export default TagPage;
