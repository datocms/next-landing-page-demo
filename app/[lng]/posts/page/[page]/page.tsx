import { fallbackLng } from '@/app/i18n/settings';
import PageIndicatorList from '@/components/Blog/PageIndicatorList';
import SingleBlog from '@/components/Blog/SingleBlog';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { postsQuery } from '@/queries/posts';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

const Blog = async ({ params }) => {
  const { lng } = params;
  const { isEnabled } = draftMode();

  const initialData = await queryDatoCMS(
    postsQuery,
    {
      locale: lng,
      fallbackLocale: fallbackLng,
      skip: (params.page - 1) * 9,
    },
    isEnabled
  );

  const { allPosts } = initialData;

  if (!allPosts.length) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName="Blog Posts" description="" />

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
          >
            <div className="w-full px-4">
              <ul className="flex items-center justify-center pt-8">
                <li className="mx-1">
                  <a
                    href={
                      params.page - 1 === 1
                        ? `/${lng}/posts`
                        : `/${lng}/posts/page/${params.page - 1}`
                    }
                    className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                  >
                    Prev
                  </a>
                </li>
                <PageIndicatorList
                  lng={lng}
                  postCount={initialData['_allPostsMeta'].count}
                />
                {params.page * 9 <= initialData['_allPostsMeta'].count && (
                  <li className="mx-1">
                    <a
                      href={`/${lng}/posts/page/${parseInt(params.page) + 1}`}
                      className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                    >
                      Next
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
