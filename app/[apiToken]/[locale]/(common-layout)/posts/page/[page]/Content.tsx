import PageIndicatorList from '@/components/PageIndicatorList';
import PostExcerpt from '@/components/PostExcerpt';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { buildUrl } from '@/utils/globalPageProps';
import { notFound } from 'next/navigation';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { page } = globalPageProps.params;

  if (data.allPosts.length === 0) {
    notFound();
  }

  return (
    <section className="pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {data.allPosts.map((post) => (
            <div
              key={post.id}
              className="mb-10 w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <PostExcerpt fragment={post} globalPageProps={globalPageProps} />
            </div>
          ))}
        </div>

        <div className=" -mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <ul className="flex items-center justify-center pt-8">
              <li className="mx-1">
                <a
                  href={
                    page - 1 === 1
                      ? buildUrl(globalPageProps, '/posts')
                      : buildUrl(globalPageProps, `/posts/page/${page - 1}`)
                  }
                  className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
                >
                  Prev
                </a>
              </li>
              <PageIndicatorList
                globalPageProps={globalPageProps}
                postCount={data._allPostsMeta.count}
                page={page}
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
